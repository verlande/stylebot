import { Command } from 'discord-akairo';
import { cache } from 'util/runescape/events'

export default class CacheCommand extends Command {
  constructor() {
    super('cache', {
      aliases: ['cache'],
      channel: 'guild',
      description: {
        content: 'Displays when the next cache will be'
      }
    })
  }

  async exec(message: Message): Promise<Message> {
    return message.channel.send(this.client.dialog('Cache', cache()));
  }
}
