import { Command } from 'discord-akairo';

export default class ResetCommand extends Command {

  constructor() {
    super('reset', {
      aliases: ['reset'],
      channel: 'guild',
      description: {
        content: 'Displays when the reset is',
      },
    });
  }

  async exec(message: Message): Promise<Message> {
    let resetTime = new Date().setUTCHours(24, 0, 0, 0) - Date.now();
    const hours = Math.floor(resetTime / 1000 / 60 / 60);
    resetTime -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(resetTime / 1000 / 60);
    resetTime -= minutes * 1000 * 60;

    let timestr = '';

    if (hours > 0) {
      timestr += `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    if (minutes > 0) {
      timestr += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return message.channel.send(this.client.dialog('Reset', `The game will reset in **${timestr}**`));
  }

}
