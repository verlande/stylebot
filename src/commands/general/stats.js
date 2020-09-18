import { Command, Argument } from 'discord-akairo';
import { MessageAttachment } from 'discord.js'
import { hiscores } from 'runescape-api';
import asciiTable from 'ascii-table';
import _ from 'lodash';
import { commaSeperatedNumbers } from 'util/string';
import sharp from 'sharp';
import spec from '../../static/specs/stats';
import { getProfile } from 'util/runescape/get-profile';
import { skillFromId } from 'util/runescape/skill-from-id';
import * as vl from 'vega-lite';
import * as vega from 'vega';

export default class StatsCommand extends Command {
    constructor() {
        super('stats', {
            aliases: ['stats'],
            args: [
                {
                    id: 'username',
                    typing: Argument.range('string', 1, 13),
                    match: 'rest',
                    default: null
                },
                {
                    id: 'pie',
                    match: 'flag',
                    flag: '--pie'
                }
            ],
            channel: 'guild',
            cooldown: 6000,
            typing: true,
            description: {
                content: 'Display user stats',
                usage: '<username>'
            }
        })
    }

    before(message: Message): any {
        this.userDb = this.client.db.User;
    }

    async exec(message: Message, { username, pie }: args): Promise<Message> {
        username = username ? username : await this.userDb.getRSN(message.author.id);

        if (pie) {
            const data = await getProfile(username);
            if (data.error === 'PROFILE_PRIVATE') return message.channel.send(this.client.errorDialog('Error', 'Private profile'));
            const xpArr = data.skillvalues.map(x => Math.round(x.xp / 10));
            const graphData = data.skillvalues.map((x, i) =>
              this.getGraphData(skillFromId(x.id), x.xp, data.totalxp, xpArr[i]));

            spec.data.values = graphData;
            spec.encoding.color.scale.domain = graphData.map(e => e.skill);
            spec.encoding.color.scale.range = graphData.map(e => e.color);

            let vegaSpec = vl.compile(spec).spec;
            let view = new vega.View(vega.parse(vegaSpec), { renderer: 'none' });
            await view.toSVG().then(async svg => {
                const buffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer();
                const attachment = new MessageAttachment(buffer, `${username}_${Date.now()}.png`);
                return message.channel.send(`\`${username}\` XP pie`, attachment);
            });

            return;
        }

        await hiscores.getPlayer(username).then(async (data: any) => {
            let levelArr = [], xpArr = [], skills = [];
            let table = new asciiTable();

            _.mapKeys(data.skills, (v, k) => {
                skills.push(k.toUpperCase());
                levelArr.push(v.level);
                xpArr.push(v.experience)
            });

            table.setTitle(`STATS FOR ${username.toUpperCase()}`);
            table.setHeading('SKILL', 'LEVEL', 'EXPERIENCE');

            for (let i = 0; i < skills.length; i++) {
                table.addRow(skills[i], levelArr[i], commaSeperatedNumbers(xpArr[i]))
            }
            return message.channel.send('`' + table.toString() + '\n`')
        }).catch(err => {
           this.client.logger.error(err); return message.channel.send(this.client.errorDialog('Error', 'Cannot find username in hiscores'));
        })
    }

    getGraphData(skill: Skill[], xp: Number, totalXp: Number, xpArr: Array<Number>): Object {
        let percentage = (xpArr * 100 / totalXp).toFixed(1) + '%';
        xp = Math.floor(xp / 10);
        return {
            skill: `${skill.name} ${percentage}`,
            xp: xp,
            color: skill.color
        };
    }
}
