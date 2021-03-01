import { Command } from 'discord-akairo';
import { voiceOfSeren } from 'util/runescape/events';

export default class VoiceOfSerenCommand extends Command {

  constructor() {
    super('voiceofseren', {
      aliases: ['voiceofseren', 'vos'],
      channel: 'guild',
      description: {
        content: 'Displays current voice of seren',
      },
    });
  }

  async exec(message: Message): Promise<Message> {
    return message.channel.send(this.client.Dialog('Voice of Seren', await voiceOfSeren()));
  }

}
