import { Message } from 'discord.js';
import { Listener, Command } from 'discord-akairo';

export default class CommandErrorListener extends Listener {

  constructor() {
    super('command:error', {
      emitter: 'command',
      event: 'error',
    });
  }

  async exec(err: Error, message: Message, command: Command): void {
    if (command && message) return new this.client.logger.error(message, command, err);
  }

}
