import DatabaseService from 'services/database/DatabaseService';

export default class UserDatabaseService extends DatabaseService {

  async getRSN(id: string): String {
    const rsn = await this.findOne({ where: { id }, raw: true, attributes: ['name'] }).catch((err) => console.log(err));
    return rsn === null ? null : rsn.name;
  }

  async setRSN(id: string, username: string) {
    const exists = await this.getRSN(id);
    return exists === null ? await this.create({
      id,
      name: username,
    })
      .catch((err) => console.log(err)) : await this.update({
      name: username,
    }, {
      where: { id },
      returning: true,
      plain: true,
    })
      .catch((err) => console.log(err));
  }

  mapUser(id: string, username: string) {
    return {
      id,
      name: username,
    };
  }

}
