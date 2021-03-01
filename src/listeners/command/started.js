import { Command, Listener } from 'discord-akairo';

export default class CommandStartedListener extends Listener {

  constructor() {
    super('command:started', {
      emitter: 'command',
      event: 'commandStarted',
    });
  }

  exec(message: Message, command: Command, args: any): void {
    this.client.logger.info(`${message.author.tag} ran '${message.content}' in ${message.channel.name || 'DM'}`, {
      event: this.event.toUpperCase(),
      userId: message.author.id,
      username: message.author.tag,
      guildName: message.guild.name,
      guildId: message.guild.id,
      channelName: message.channel.name,
      channelId: message.channel.id,
      args,
    });
  }

}
