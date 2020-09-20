import { Listener, Command } from 'discord-akairo';

export default class CommandStartedListener extends Listener {
    constructor() {
        super('command:executed', {
            emitter: 'command',
            event: 'commandFinished'
        });
    }

    exec(message: Message, command: Command, args: any, returnValue: any) {
        this.client.logger.info(`${message.author.tag} successfully executed '${message.content}' in ${message.channel.name || 'DM'}`, {
            event: this.event.toUpperCase(),
            userId: message.author.id,
            username: message.author.tag,
            guildName: message.guild.name,
            guildId: message.guild.id,
            channelName: message.channel.name,
            channelId: message.channel.id,
            args: args
        });
    }
}
