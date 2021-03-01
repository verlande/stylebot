import { Command } from 'discord-akairo';
import { spotlight } from 'util/runescape/events';

export default class SpotLightCommand extends Command {

  constructor() {
    super('spotlight', {
      aliases: ['spotlight', 'sl'],
      channel: 'guild',
      description: {
        content: 'Displays current spot light',
      },
    });
  }

  async exec(message: Message): Promise<Message> {
    return message.channel.send(this.client.Dialog('Spotlight', spotlight()));
  }

}
