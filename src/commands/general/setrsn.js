import { Argument, Command } from 'discord-akairo';

export default class SetRSNCommand extends Command {
    constructor() {
        super('setrsn', {
            aliases: ['setrsn'],
            channel: 'guild',
            args: [
                {
                    id: 'username',
                    type: Argument.range('string', 1, 12),
                    match: 'content',
                    default: null
                }
            ],
            description: {
                content: 'Set rsn to your discord',
                usage: '[rsn]'
            },
            typing: true,
            cooldown: 5000,
            ratelimit: 1,
        });
    }

    before() {
        this.db = this.client.db.User;
    };

    async exec(message: Message, { username }: args): Promise<Message> {
        if (username == null) return;
        try {
            await this.db.setRSN(message.author.id, username);
            return message.channel.send(this.client.dialog('Set RSN', `RSN set to ${username}`));
        } catch (e) {
            console.log(e);
        }
    }
}
