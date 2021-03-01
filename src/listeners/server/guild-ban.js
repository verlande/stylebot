import { Guild, User } from 'discord.js';
import { Listener } from 'discord-akairo';

export default class GuildBanListener extends Listener {

  constructor() {
    super('client:guildBanAdd', {
      emitter: 'client',
      event: 'guildBanAdd',
    });
  }

  exec(guild: Guild, user: User) {
    this.client.loggers.ban.info(`${user.tag} has been banned in ${guild.name} `, {
      user,
    });
  }

}
