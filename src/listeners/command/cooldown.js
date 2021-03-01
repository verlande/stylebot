import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class CooldownListener extends Listener {

  constructor() {
    super('command:cooldown', {
      emitter: 'command',
      event: 'cooldown',
    });
  }

  async exec(message: Message, command: Command, remaining: Number): Promise<Message> {
    this.client.logger.info(`${message.author.tag} tried executing ${command} on cooldown [${remaining.toFixed(2) / 1000}s]`, {
      event: this.event.toUpperCase(),
      userId: message.author.id,
      username: message.author.tag,
      guildName: message.guild.name,
      guildId: message.guild.id,
      channelName: message.channel.name,
      channelId: message.channel.id,
    });
    return message.channel.send(new this.client.ErrorDialog('Cooldown', `You can use \`${command}\` in ${remaining.toFixed(2) / 1000}s`))
      .then((m) => setTimeout(() => m.delete()), 3000);
  }

}
