import { Command } from 'discord-akairo';
import { warbands } from 'util/runescape/events';

export default class WarBandsCommand extends Command {
    constructor() {
        super('warbands', {
            aliases: ['warbands', 'wbs'],
            channel: 'guild',
            description: {
                content: 'Displays when warbands starts'
            }
        })
    }

    async exec(message: Message): Promise<Message> {
        return message.channel.send(this.client.dialog('Warbands', warbands()));
    }
}
