import DatabaseService from 'services/database/DatabaseService';

export default class UserDatabaseService extends DatabaseService {
    async getRSN(id: string): String {
        const rsn =  await this.findOne({ where: { id: id }, raw: true, attributes: ['name'] }).catch(err => console.log(err));
        return rsn === null ? null : rsn.name;
    }

    async setRSN(id: string, username: string) {
        console.log(id, username);
        const exists = await this.getRSN(id);
        if (exists === null) {
            return await this.create({id: id, name: username}).catch(err => console.log(err));
        }
        else
            return await this.update({
                name: username
            }, {
                where: { id: id },
                returning: true,
                plain: true
            }).catch(err => console.log(err));
    }

    mapUser(id: string, username: string) {
        return {
            id: id,
            name: username
        };
    }
}
