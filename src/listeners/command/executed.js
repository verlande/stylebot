import { Listener, Command } from 'discord-akairo';

export default class CommandStartedListener extends Listener {
    constructor() {
        super('command:executed', {
            emitter: 'command',
            event: 'commandFinished'
        });
    }

    exec(message: Message, command: Command, args: any, returnValue: any) {
        this.client.logger.info(`[${this.event.toUpperCase()}] ${message.author.tag} successfully executed '${message.content}' in ${message.channel.name || 'DM'}`);
    }
}