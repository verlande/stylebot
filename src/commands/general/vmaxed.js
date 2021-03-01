import { Command, Argument } from 'discord-akairo';
import { getProfile } from 'util/runescape/get-profile';
import { TOTAL_XP_AT_ALL_120, xpUntil120, SKILL_COUNT } from 'util/runescape/xp';
import { skillFromId } from 'util/runescape/skill-from-id';
import { commaSeperatedNumbers } from 'util/string';
import * as vega from 'vega';
import sharp from 'sharp';
import { MessageAttachment } from 'discord.js';
import spec from '../../static/specs/maxed';

export default class VMaxedCommand extends Command {

  constructor() {
    super('vmaxed', {
      aliases: ['vmaxed'],
      channel: 'guild',
      typing: true,
      args: [
        {
          id: 'username',
          type: Argument.range('string', 0, 13),
          match: 'rest',
          default: null,
        },
        {
          id: 'chart',
          match: 'flag',
          flag: '--chart',
        },
      ],
      description: {
        content: 'Calculates remaining XP for each skill to level 120',
        usage: '<username>',
      },
    });
  }

  before() {
    this.userDb = this.client.db.User;
  }

  async exec(message: Message, { username, chart }: args): Promise<Message> {
    username = username || await this.userDb.getRSN(message.author.id);
    // TODO: Throw error for 404
    const profile = await getProfile(username);

    if (profile.error === 'NO_PROFILE') return message.channel.send(this.client.ErrorDialog('Error', 'No user found'));
    if (profile.error === 'PROFILE_PRIVATE') return message.channel.send(this.client.ErrorDialog('Error', 'Private profile'));

    const skills = profile.skillvalues;

    if (chart && username) {
      const stats = this.calculateSkillGraph(skills);

      if (stats.maxedSkillCount === SKILL_COUNT) {
        return message.channel.send(this.client.Dialog('Virtual Maxed', 'Your already virtual maxed! :partying_face:'));
      }

      const dataValues = stats.remaining.filter((x) => x.percent < 100);

      spec.title.text = username.toUpperCase();
      spec.title.subtitle = [`${stats.totalPercentToMax}% to virtual max`, `${stats.notMaxedSkillCount} skills are missing a total of ${commaSeperatedNumbers(stats.totalRemainingXp)} XP`];
      spec.data[0].values = dataValues;
      const view = new vega.View(vega.parse(spec), { renderer: 'none' });
      await view.toSVG().then(async (svg) => {
        const buffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer();
        const attachment = new MessageAttachment(buffer, `${username}_${Date.now()}.png`);
        return message.channel.send(`\`${username}\` virtual maxed chart`, attachment);
      });
      return;
    }
    this.getNumberOf120Skills(skills);
    const stats = this.calculateSkillStats(skills);

    let str = `**${username}** is __${stats.totalPercentToMax}%__ to virtual max\n`;

    if (stats.notMaxedSkillCount > 0 && stats.totalPercentToMax < 100) {
      const { totalRemainingXp } = stats;
      str += `\n${stats.notMaxedSkillCount} skills are missing a total of ${commaSeperatedNumbers(totalRemainingXp)} xp`;
      str += `\nHe has ${stats.maxedSkillCount} of ${skills.length} skills\n`;

      for (const skill of stats.remaining) {
        const skillName = skillFromId(skill.skillId).name;
        const remainingXp = skill.remaining;
        const xp = skills.find((it) => it.id === skill.skillid)?.xp;

        if (xp === -1) {
          str += `\n\t${skillName}: Is not on the hiscores`;
        } else if (remainingXp !== 0) {
          str += `\n\t***${skillName}:*** ${skill.percentTo120}% (${commaSeperatedNumbers(remainingXp)}) xp remaining`;
        }
      }
    } else {
      str += '\nYour already maxed! :partying_face:';
    }
    return message.channel.send(this.client.Dialog('Virtual Maxed', str));
  }

  getNumberOf120Skills(skills: Skill[]): Number {
    return skills.filter((skill) => skill.level >= 120).length;
  }

  calculateSkillStats(skills: Skill[]): Object {
    // const maxedSkillCount = this.getNumberOf120Skills(skills);
    const remaining = this.getSkillRemainingXp(skills).map((remainder) => ({
      skillId: remainder.skillId,
      remaining: remainder.remaining,
      max: remainder.max,
      percentTo120: Math.round((100 * remainder.current) / remainder.max),
    }));

    const notMaxedSkillCount = remaining.filter((x) => x.percentTo120 < 100).length;
    const maxedSkillCount = skills.length - notMaxedSkillCount;
    const percentSkillsMaxed = Math.round((100 * maxedSkillCount) / skills.length);
    const totalRemainingXp = remaining.map((skill) => skill.remaining).reduce((sum, xp) => sum + xp, 0);
    const totalxpAt120 = TOTAL_XP_AT_ALL_120;
    const totalPercentToMax = Math.round(
      (100 * (totalxpAt120 - totalRemainingXp)) / totalxpAt120,
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
    const notMaxed = skills.filter((skill) => skill.level < 120);
    return notMaxed.map((skill) => xpUntil120(skillFromId(skill.id), skill.xp));
  }

  calculateSkillGraph(skills): Object {
    const maxedSkillCount = this.getNumberOf120Skills(skills);
    const notMaxedSkillCount = skills.length - maxedSkillCount;
    const percentSkillsMaxed = Math.round((100 * maxedSkillCount) / skills.length);
    const remaining = this.getSkillRemainingXp(skills).map((remainder) => ({
      skill: skillFromId(remainder.skillId).name,
      remaining: remainder.remaining,
      position: 0,
      percent: Math.round((100 * remainder.current) / remainder.max),
    }));
    const totalRemainingXp = remaining.map((skill) => skill.remaining).reduce((sum, xp) => sum + xp, 0);
    const totalxpAt120 = TOTAL_XP_AT_ALL_120;
    const totalPercentToMax = Math.round(
      (100 * (totalxpAt120 - totalRemainingXp)) / totalxpAt120,
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

}
