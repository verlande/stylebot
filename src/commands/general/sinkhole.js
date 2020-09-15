import { Command } from 'discord-akairo';
import { sinkhole } from 'util/runescape/events';

export default class SinkholeCommand extends Command {
    constructor() {
        super('sinkhole', {
            aliases: ['sinkhole', 'sinkholes'],
            channel: 'guild',
            description: {
                content: 'Displays when the next sinkhole is'
            }
        })
    }

    async exec(message: Message): Promise<Message> {
        return message.channel.send(this.client.dialog('Sinkhole', sinkhole()));
    }
}
