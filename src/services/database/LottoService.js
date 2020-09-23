import DatabaseService from 'services/database/DatabaseService';
import { AkairoError } from 'discord-akairo';

export default class LottoDatabaseService extends DatabaseService {

  async getEntries(options: object = {}) {
    try {
      return await this.findAll(options);
    } catch (e) {
      throw new AkairoError(e);
    }
  }

  create(name: String) {
    return super.create(this.mapLotto(name));
  }

  mapLotto(name) {
    return {
      name,
    };
  }

}
