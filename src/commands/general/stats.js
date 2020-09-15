import {Command, Argument} from 'discord-akairo';
import {MessageEmbed} from 'discord.js';
import {hiscores} from 'runescape-api';
import asciiTable from 'ascii-table';
import _ from 'lodash';
import got from 'got';
import cheerio from 'cheerio';
import {commaSeperatedNumbers} from 'util/string';

export default class StatsCommand extends Command {
    constructor() {
        super('stats', {
            aliases: ['stats'],
            args: [
                {
                    id: 'username',
                    typing: Argument.range('string', 1, 12),
                    match: 'content',
                    default: null
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

    async exec(message: Message, {username}: args): Promise<Message> {
        username = username ? username : await this.userDb.getRSN(message.author.id);
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
}
