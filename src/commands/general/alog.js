import { Command, Argument } from 'discord-akairo';
import { Message } from 'discord.js';
import { runemetrics } from 'runescape-api';

export default class AlogCommand extends Command {

  constructor() {
    super('alog', {
      aliases: ['alog'],
      args: [
        {
          id: 'username',
          typing: Argument.range('string', 1, 12),
          match: 'content',
          default: null,
        },
      ],
      channel: 'guild',
      cooldown: 4000,
      typing: true,
      description: {
        content: 'Display adventure log',
        usage: '<username>',
      },
    });
  }

  before() {
    this.userDb = this.client.db.User;
  }

  async exec(message: Message, { username }: args): Promise<Message> {
    username = username || await this.userDb.getRSN(message.author.id);
    await runemetrics.getProfile(username).then(async (data: any) => {
      let str = '';

      data.activities.forEach((e) => {
        str += `[${e.date}] ${e.title}\n`;
      });

      return message.channel.send(this.client.dialog(`${username} adventure log`,
        `\`\`\`${str}\`\`\``).setThumbnail(`https://secure.runescape.com/m=avatar-rs/${encodeURI(username)}/chat.png`));
    }).catch((err) => {
      this.client.logger.error(err); return message.channel.send(this.client.errorDialog('Error', 'Profile private'));
    });
  }

}
