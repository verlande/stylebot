import { Command, Argument } from 'discord-akairo';
import { MessageAttachment } from 'discord.js';
import { hiscores } from 'runescape-api';
import { getProfile } from 'util/runescape/get-profile';
import { xpUntil99, TOTAL_XP_AT_ALL_99, SKILL_COUNT } from 'util/runescape/xp';
import { skillFromId } from 'util/runescape/skill-from-id';
import { commaSeperatedNumbers } from 'util/string';
import * as vega from 'vega';
import sharp from 'sharp';
import spec from '../../static/specs/maxed'

export default class MaxedCommand extends Command {
    constructor() {
        super('maxed', {
            aliases: ['maxed'],
            channel: 'guild',
            typing: true,
            args: [
                {
                    id: 'username',
                    type: Argument.range('string', 0, 13),
                    match: 'rest',
                    default: null
                },
                {
                    id: 'chart',
                    match: 'flag',
                    flag: '--chart'
                }
            ],
            description: {
                content: 'Displays remaining to maxed',
                usage: '<username>'
            }
        })
    }

    before(message: Message): any {
        this.userDb = this.client.db.User;
    }

    async exec(message: Message, { username, chart }: args): Promise<Message> {
        username = username ? username : await this.userDb.getRSN(message.author.id);
        //TODO: Throw error for 404
        const profile = await getProfile(username);

        if (profile.error === 'NO_PROFILE') return message.channel.send(this.client.errorDialog('Error', 'No user found'));
        if (profile.error === 'PROFILE_PRIVATE') return message.channel.send(this.client.errorDialog('Error', 'Private profile'));

        const skills = profile.skillvalues;

        if (chart && username) {
            const stats = this.calculateSkillGraph(skills);

            if (stats.maxedSkillCount === SKILL_COUNT) {
                return message.channel.send(this.client.dialog('Maxed', 'Your already maxed! :partying_face:'))
            }

            const dataValues = stats.remaining.filter(x => x.percent < 100);

            spec.title.text = username.toUpperCase();
            spec.title.subtitle = [`${stats.totalPercentToMax}% to max`, `${stats.notMaxedSkillCount} skills are missing a total of ${commaSeperatedNumbers(stats.totalRemainingXp)} XP`];
            spec.data[0].values = dataValues;
            const view = new vega.View(vega.parse(spec), { renderer: 'none' });
            await view.toSVG().then(async svg => {
               const buffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer();
               const attachment = new MessageAttachment(buffer, `${username}_${Date.now()}.png`);
               return message.channel.send(`\`${username}\` maxed chart`, attachment);
            });
            return;
        }

        const maxedSkills = this.getNumberOf99Skills(skills);

        const stats = this.calculateSkillStats(skills);


        let str = `**${username}** is __${stats.totalPercentToMax}%__ to max\n`;

        str += `\nHe has ${stats.maxedSkillCount} of ${skills.length} skills\n`;

        if (stats.notMaxedSkillCount > 0) {
            const totalRemainingXp = stats.totalRemainingXp;
            str += `\n${stats.notMaxedSkillCount} skills are missing a total of ${commaSeperatedNumbers(totalRemainingXp)} xp`;

            for (const skill of stats.remaining) {
                const skillName = skillFromId(skill.skillId).name;
                const remainingXp = skill.remaining;
                const xp = skills.find(it => it.id === skill.skillid)?.xp;

                if (xp === -1) {
                    str += `\n\t${skillName}: Is not on the hiscores`;
                } else {
                    str += `\n\t***${skillName}:*** ${skill.percentTo99}% (${commaSeperatedNumbers(remainingXp)}) xp remaining`;
                }
            }
        } else {
            str += `\nYour already maxed! :partying_face:`
        }
        return message.channel.send(this.client.dialog('Maxed', str));

    }

    getNumberOf99Skills(skills: Skill[]) {
        return skills.filter(skill => skill.level >= 99).length;
    }

    calculateSkillStats(skills: Skill[]) {
        const maxedSkillCount = this.getNumberOf99Skills(skills);
        const notMaxedSkillCount = skills.length - maxedSkillCount;
        const percentSkillsMaxed = Math.round(
            (100 * maxedSkillCount) / skills.length
        );
        const remaining = this.getSkillRemainingXp(skills).map(remainder => ({
            skillId: remainder.skillId,
            remaining: remainder.remaining,
            max: remainder.max,
            percentTo99: Math.round((100 * remainder.current) / remainder.max),
        }));
        const totalRemainingXp = remaining
            .map(skill => skill.remaining)
            .reduce((sum, xp) => sum + xp, 0);
        const totalXpAt99 = TOTAL_XP_AT_ALL_99;
        const totalPercentToMax = Math.round(
            (100 * (totalXpAt99 - totalRemainingXp)) / totalXpAt99
        );

        return {
            maxedSkillCount,
            notMaxedSkillCount,
            percentSkillsMaxed,
            remaining,
            totalRemainingXp,
            totalPercentToMax,
        };
    }

    getSkillRemainingXp(skills: Skill[]) {
        let notMaxed = skills.filter(skill => skill.level < 99);
        return notMaxed.map(skill => xpUntil99(skillFromId(skill.id), skill.xp));
    }

    calculateSkillGraph(skills): Object {
        const maxedSkillCount = this.getNumberOf99Skills(skills);
        const notMaxedSkillCount = skills.length - maxedSkillCount;
        const percentSkillsMaxed = Math.round((100 * maxedSkillCount) / skills.length);
        const remaining = this.getSkillRemainingXp(skills).map(remainder => ({
            skill: skillFromId(remainder.skillId).name,
            remaining: remainder.remaining,
            position: 0,
            percent: Math.round((100 * remainder.current) / remainder.max)
        }));
        const totalRemainingXp = remaining.map(skill => skill.remaining).reduce((sum, xp) => sum + xp, 0);
        const totalxpAt99 = TOTAL_XP_AT_ALL_99;
        const totalPercentToMax = Math.round(
          (100 * (totalxpAt99 - totalRemainingXp)) / totalxpAt99
        );

        return {
            maxedSkillCount,
            notMaxedSkillCount,
            percentSkillsMaxed,
            remaining,
            totalRemainingXp,
            totalPercentToMax,
        };
    };
}
