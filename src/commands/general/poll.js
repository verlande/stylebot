import { Command, Argument } from 'discord-akairo';

export default class PollCommand extends Command {
    constructor() {
        super('poll', {
            aliases: ['poll'],
            channel: 'guild',
            args: [
                {
                    id: 'question',
                    type: Argument.range('string', 10, 255),
                    match: 'content'
                }
            ],
            description: {
                content: 'Make a simple poll',
                usage: '[question]'
            },
            clientPermissions: ['MANAGE_MESSAGES']
        })
    }

    async exec(message: Message, { question }: args): Promise<Message> {
        if (question === null) return message.channel.send(this.client.errorDialog('Error', 'Question must be between 10 to 255 long'));

        message.delete();
        let msg = await message.channel.send(this.client.dialog('Poll', question));
        await msg.react('👍🏼');
        await msg.react('👎🏼');
        await msg.react('❓');
    }
}