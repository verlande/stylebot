import { Command } from 'discord-akairo';
import { getProfile } from 'util/runescape/get-profile';
import { skillFromId } from 'util/runescape/skill-from-id';
import * as vega from 'vega';
import sharp from 'sharp';
import { MessageAttachment } from 'discord.js';
import * as vl from 'vega-lite';
import spec from '../../static/specs/compare';

export default class CompareCommand extends Command {

  constructor() {
    super('compare', {
      aliases: ['compare'],
      channel: 'guild',
      typing: true,
      separator: ',',
      args: [
        {
          id: 'usernames',
          type: 'string',
          match: 'separate',
          default: null,
        },
      ],
      description: {
        content: 'Displays chart comparing stats',
        usage: '[username,username]',
      },
    });
  }

  async exec(message: Message, { usernames }: args): Promise<Message> {
    if (usernames.length > 2) return message.channel.send(this.client.errorDialog('Error', 'Only 2 usersnames'));

    let profile = await getProfile(usernames[0]);
    let profile2 = await getProfile(usernames[1]);

    if (profile.error === 'NO_PROFILE' || profile2.error === 'NO_PROFILE') {
      return message.channel.send(this.client.errorDialog('Error', 'One of the users not found'));
    }
    if (profile.error === 'PROFILE_PRIVATE' || profile2.error === 'PROFILE_PRIVATE') {
      return message.channel.send(this.client.errorDialog('Error', 'One of the users has private profile'));
    }

    profile = profile.skillvalues; profile2 = profile2.skillvalues;
    const data = [];

    profile.map((x, i) => {
      data.push({
        skill: skillFromId(profile[i].id).name, username: usernames[0].toUpperCase(), position: 0, value: profile[i].xp / 10,
      });
      data.push({
        skill: skillFromId(profile2[i].id).name, username: usernames[1].toUpperCase(), position: 1, value: profile2[i].xp / 10,
      });
    });

    spec.data.values = data;
    const vegaSpec = vl.compile(spec).spec;
    const view = new vega.View(vega.parse(vegaSpec), { renderer: 'none' });
    await view.toSVG().then(async (svg) => {
      const buffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer();
      const attachment = new MessageAttachment(buffer, `${usernames[0] - usernames[1]}_${Date.now()}.png`);
      return message.channel.send(`\`${usernames[0]}\` & \`${usernames[1]}\` compare chart`, attachment);
    });
  }

}
