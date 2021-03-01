import { Guild, User } from 'discord.js';
import { Listener } from 'discord-akairo';

export default class GuildBanRemoveListener extends Listener {

  constructor() {
    super('client:guildBanRemove', {
      emitter: 'client',
      event: 'guildBanRemove',
    });
  }

  exec(guild: Guild, user: User) {
    this.client.loggers.ban.info(`${user.tag} has been unbanned in ${guild.name} `, {
      user,
    });
  }

}
