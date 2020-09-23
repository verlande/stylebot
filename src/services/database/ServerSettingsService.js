import {
  difference, get, merge, omit, remove, set,
} from 'lodash';
import DatabaseService from 'services/database/DatabaseService';
import Constants from 'constants';
import { ServerSettings } from 'models/database/StyleServerSettings';
import { getPaths } from 'util/object';

const PATHS_TO_REMOVE = [
  'jftCron',
  'meeting',
  'admin',
];

export default class ServerSettingsDatabaseService extends DatabaseService {

  async getSettingsForServer(id: String, options: object = {}) {
    try {
      const defaults = new ServerSettings();
      const result = await this.findById(id, options);

      result.set('settings', JSON.parse(JSON.stringify(merge(
        defaults,
        omit(result.get('settings'), difference(getPaths(result.get('settings')), getPaths(JSON.parse(JSON.stringify(defaults))))),
      ))));

      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async setSettingsForServer(id: String, { settings }: any) {
    try {
      await this.validate(merge(new ServerSettings(), settings));

      const result = await this.findById(id);
      await result.update({ settings });
    } catch (e) {
      throw new Error(e);
    }
  }

  async getSettingForServer(id: String, property: String) {
    try {
      const settings = (await this.getSettingsForServer(id)).get();
      return get(settings, ['settings', property].join('.'));
    } catch (e) {
      throw new Error(e);
    }
  }

  async setSettingForServer(id: String, property: String, value: any) {
    try {
      const settings = (await this.getSettingsForServer(id)).get();
      if (!this.getSettingsPaths(settings)) {
        throw new Error('Unable to set.');
      }

      set(settings, ['settings', property].join('.'), value);
      await this.setSettingsForServer(id, settings);

      this.emit(
        Constants.Events.SERVER_SETTING_UPDATED,
        id,
        property,
        value,
      );
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  getSettingsPaths(settings) {
    return remove(getPaths(settings), (v) => !PATHS_TO_REMOVE.includes(v));
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
    };
  }

}
