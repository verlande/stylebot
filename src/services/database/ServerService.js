import DatabaseService from 'services/database/DatabaseService';
import {AkairoError} from 'discord-akairo';

export default class ServerDatabaseService extends DatabaseService {
  async getServer(id: String, options: object = {}) {
    try {
      return await this.findById(id, options);
    } catch (e) {
      throw new AkairoError(e);
    }
  }

  bulkFindOrCreate(servers: Array) {
    const serversArray = Array.isArray(servers)
      ? servers.map((server) => this.mapGuild(server))
      : Array.from(servers).map(([, server]) => this.mapGuild(server));

    return super.bulkFindOrCreate(serversArray);
  }

  mapGuild(guild) {
    return {
      id: guild.id,
      name: guild.name,
      since: guild.joinedTimestamp,
      owners: [guild.ownerID],
      region: guild.region,
    };
  }
}
