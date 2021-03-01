import { Command } from 'discord-akairo';
import { warbands } from 'util/runescape/events';

export default class WarBandsCommand extends Command {

  constructor() {
    super('warbands', {
      aliases: ['warbands', 'wbs'],
      channel: 'guild',
      tying: true,
      description: {
        content: 'Displays when warbands starts',
      },
    });
  }

  async exec(message: Message): Promise<Message> {
    const hours = warbands()[0]; const
      minutes = warbands()[1];
    let str = '';

    if (hours > 0 && minutes === 0) {
      str += `**${hours} hour${hours > 1 ? 's' : ''}**`;
    }

    if (hours > 0 && minutes > 1) {
      str += `**${hours} hour${hours > 1 ? 's' : ''}** and **${minutes} minute${minutes > 0 && minutes < 2 ? '' : 's'}**`;
    }

    if (hours < 1 && minutes > 1) {
      str += `**${minutes} minute${minutes > 0 && minutes < 2 ? '' : 's'}**`;
    }

    if (minutes < 1 && hours < 1) {
      str += '**less than a minute**';
    }
    return message.channel.send(this.client.Dialog('Warbands', `Starts in ${str}`));
  }

}
