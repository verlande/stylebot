import { Listener } from 'discord-akairo';
import { Guild } from 'discord.js';

export default class ClientGuildCreateListener extends Listener {
  constructor() {
    super('client:guildCreate', {
      emitter: 'client',
      event: 'guildCreate',
    });
  }

  async exec(server: Guild) {
    this.client.logger.info(`[${this.event.toUpperCase()}] Connected to server ${server.name} (ID: ${server.id})`);
    try {
      const defaults = this.client.db.Server.mapGuild(server);
      await this.client.db.Server.findOrCreate({ where: { id: defaults.id }, defaults });
      await this.client.db.ServerSettings.findOrCreate({ where: { id: defaults.id }, defaults });
    } catch (e) {
      this.client.logger.warn(e);
    }
  }
}
