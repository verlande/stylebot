import DatabaseService from 'services/database/DatabaseService';

export default class ClanMemberDatabaseService extends DatabaseService {

  async getAllMemebers() {
    return await this.findAll({ attributes: ['name'], raw: true });
    // return await this.findOne({ where: { id: id }, raw: true, attributes: ['name'] });
  }

  async addClanMember(username: string) {
    return await this.create({ name: username }).catch((err) => console.log(err));
  }

  async removeClanMember(username: string) {
    return await this.destroy({ where: { name: username } });
  }

  mapUser(username: string) {
    return {
      name: username,
    };
  }

}
