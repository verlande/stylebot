import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

export default class ClientGuildCreateListener extends Listener {
  constructor() {
    super('client:guildCreate', {
      emitter: 'client',
      event: 'guildCreate',
    });
  }

  async exec(guild: Guild) {
    this.client.logger.info(`Connected to server ${guild.name} (ID: ${guild.id})`, {
      event: this.event.toUpperCase(),
      guildName: guild.name,
      guildId: guild.id,
      guildOwnerId: guild.ownerID,
      guildOwnerTag: guild.owner.user.tag
    });
    try {
      const defaults = this.client.db.Server.mapGuild(server);
      await this.client.db.Server.findOrCreate({ where: { id: defaults.id }, defaults });
      await this.client.db.ServerSettings.findOrCreate({ where: { id: defaults.id }, defaults });
    } catch (e) {
      this.client.logger.warn(e);
    }
  }
}
