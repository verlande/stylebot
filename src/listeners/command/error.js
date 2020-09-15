import { Message } from 'discord.js';
import { Listener, Command } from 'discord-akairo';

export default class CommandErrorListener extends Listener {
    constructor() {
        super('command:error', {
            emitter: 'command',
            event: 'error'
        });
    }

    exec(err: Error, message: Message, command: Command) {
        if (command && message) return new this.client.logger.error(message, command, err);
    }
}