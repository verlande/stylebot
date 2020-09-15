import { Command } from 'discord-akairo';
import go from 'got';
import { voiceOfSeren } from 'util/runescape/events'

export default class VoiceOfSerenCommand extends Command {
    constructor() {
        super('voiceofseren', {
            aliases: ['voiceofseren', 'vos'],
            channel: 'guild',
            description: {
                content: 'Displays current voice of seren'
            }
        })
    }

    async exec(message: Message): Promise<Message> {
        return message.channel.send(this.client.dialog('Voice of Seren', await voiceOfSeren()));
        // (async () => {
        //     await go.get('https://chisel.weirdgloop.org/api/runescape/vos', {
        //         responseType: 'json'
        //     }).then(response => {
        //         const districts = response.body.districts;
        //         return message.channel.send(this.client.dialog('Voice of Seren', `Currently active in ${districts[0]} & ${districts[1]}`));
        //     })
        // })();
    }
}
