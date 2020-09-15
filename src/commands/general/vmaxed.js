import { Command, Argument } from 'discord-akairo';
import {hiscores} from 'runescape-api';
import { getProfile } from 'util/runescape/get-profile';
import { xpUntil99, TOTAL_XP_AT_ALL_99, TOTAL_XP_AT_ALL_120, xpUntil120 } from 'util/runescape/xp';
import { skillFromId } from 'util/runescape/skill-from-id';
import { commaSeperatedNumbers } from 'util/string'
import { getSkillCurve } from '../../util/runescape/skillcurves';

export default class VMaxedCommand extends Command {
  constructor() {
    super('vmaxed', {
      aliases: ['vmaxed'],
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
        content: 'Displays remaining to 120'
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

    const maxedSkills = this.getNumberOf120Skills(skills);
    const stats = this.calculateSkillStats(skills); console.log(stats);

    let str = `**${username}** is __${stats.totalPercentToMax}%__ to 120 max\n`;

    if (stats.notMaxedSkillCount > 0 && stats.totalPercentToMax < 100) {
      const totalRemainingXp = stats.totalRemainingXp;
      str += `\n${stats.notMaxedSkillCount} skills are missing a total of ${commaSeperatedNumbers(totalRemainingXp)} xp`;
      str += `\nHe has ${stats.maxedSkillCount} of ${skills.length} skills\n`;

      for (const skill of stats.remaining) {
        const skillName = skillFromId(skill.skillId).name;
        const remainingXp = skill.remaining;
        const xp = skills.find(it => it.id === skill.skillid)?.xp;

        if (xp === -1) {
          str += `\n\t${skillName}: Is not on the hiscores`;
        } else if (remainingXp !== 0) {
          str += `\n\t***${skillName}:*** ${skill.percentTo120}% (${commaSeperatedNumbers(remainingXp)}) xp remaining`;
        }
      }
    } else {
      str += `\nYour already maxed! :partying_face:`
    }
    return message.channel.send(this.client.dialog('Virtual Maxed', str));
  }

  getNumberOf120Skills(skills: Skill[]): Number {
    return skills.filter(skill => skill.level >= 120).length;
  }

  calculateSkillStats(skills: Skill[]): Object {
    const maxedSkillCount = this.getNumberOf120Skills(skills);
    const notMaxedSkillCount = skills.length - maxedSkillCount;
    const percentSkillsMaxed = Math.round((100 * maxedSkillCount) / skills.length);
    const remaining = this.getSkillRemainingXp(skills).map(remainder => ({
      skillId: remainder.skillId,
      remaining: remainder.remaining,
      max: remainder.max,
      percentTo120: Math.round((100 * remainder.current) / remainder.max)
    }));
    const totalRemainingXp = remaining.map(skill => skill.remaining).reduce((sum, xp) => sum + xp, 0);
    const totalxpAt120 = TOTAL_XP_AT_ALL_120;
    const totalPercentToMax = Math.round(
      (100 * (totalxpAt120 - totalRemainingXp)) / totalxpAt120
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
    let notMaxed = skills.filter(skill => skill.level < 120);
    return notMaxed.map(skill => xpUntil120(skillFromId(skill.id), skill.xp));
}

  xpUntil120 = (skill, xp) => {
    //TODO: XP is fucked on API
    xp = Math.floor(xp / 10);

    const curve = getSkillCurve(skill.skillCurve);
    const xpAt99 = curve.get(99) || -1;
    if (xpAt99 === -1) {
      throw new Error(`Failed to find xp curve for skill ${skill.id}`);
    }
    let remaining = xpAt99 - xp;
    if (remaining < 0) {
      remaining = 0;
    }
    return {
      skillId: skill.id,
      remaining,
      current: xp,
      max: xpAt99,
    };
  }
}
