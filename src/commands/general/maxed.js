import { Command, Argument } from 'discord-akairo';
import {hiscores} from 'runescape-api';
import { getProfile } from 'util/runescape/get-profile';
import { xpUntil99, TOTAL_XP_AT_ALL_99 } from 'util/runescape/xp';
import { skillFromId } from 'util/runescape/skill-from-id';
import { commaSeperatedNumbers } from 'util/string'

export default class MaxedCommand extends Command {
    constructor() {
        super('maxed', {
            aliases: ['maxed'],
            channel: 'guild',
            args: [
                {
                    id: 'username',
                    type: Argument.range('string', 0, 12),
                    match: 'content',
                    default: null
                }
            ],
            description: {
                content: 'Displays remaining to maxed'
            }
        })
    }

    before(message: Message): any {
        this.userDb = this.client.db.User;
    }

    async exec(message: Message, {username}: args): Promise<Message> {
        username = username ? username : await this.userDb.getRSN(message.author.id);
        //TODO: Throw error for 404
        const profile = await getProfile(username);

        if (profile.error === 'PROFILE_PRIVATE') return message.channel.send(this.client.errorDialog('Error', 'Private profile'));

        const skills = profile.skillvalues;

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
}
