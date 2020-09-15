import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class StyleError {
    message: Message;
    command: Command;
    err: Error;

    /**
     * Constructor for BotError.
     * @param message - The Message object of the client.
     * @param command - The command that was used.
     * @param error - The Error object, if there is one.
     */
    constructor(message: Message, command: Command, error: Error = null) {
      this.message = message;
      this.command = command;
      this.err = error;
      this.exec();
    }

    exec() {
      if (this.err && this.command) this.command.client.logger.error(this.err);
    }
}
