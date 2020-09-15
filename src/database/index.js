import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import { Sequelize, Repository } from 'sequelize-typescript';
import StyleServer from 'models/database/StyleServer';
import StyleMeeting from 'models/database/StyleMeeting';
import StyleUser from 'models/database/StyleUser';
import StyleLotto from 'models/database/StyleLotto';
import StyleClanMembers from 'models/database/StyleClanMembers';
import StyleServerSettings from 'models/database/StyleServerSettings';
import UserDatabaseService from 'services/database/UserService';
import LottoDatabaseService from 'services/database/LottoService';
import ClanMemberDatabaseService from 'services/database/ClanMemberService';
import ServerDatabaseService from 'services/database/ServerService';
import MeetingDatabaseService from 'services/database/MeetingService';
import ServerSettingsDatabaseService from 'services/database/ServerSettingsService';

const databasePath = path.normalize(`${__dirname}/../.data/`);
const databaseName = 'style.sqlite';

// Create our database files if this is our first load.
(() => {
  try {
    if (!fs.existsSync(databasePath)) {
      fs.mkdirSync(databasePath);
    }

    fs.writeFileSync(path.normalize(databasePath + databaseName), '', { flag: 'wx' });
    return true;
  } catch (e) {
    return false;
  }
})();


export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.normalize(databasePath + databaseName),
  define: {
    freezeTableName: true,
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  logging: false,
  models: [
    StyleServer,
    StyleServerSettings,
    StyleMeeting,
    StyleUser,
    StyleLotto,
    StyleClanMembers,
  ],
});

export const create = () => ({
  sequelize,
  Op,
  Server: new ServerDatabaseService(sequelize, StyleServer),
  ServerSettings: new ServerSettingsDatabaseService(sequelize, StyleServerSettings),
  Meeting: new MeetingDatabaseService(sequelize, StyleMeeting),
  User: new UserDatabaseService(sequelize, StyleUser),
  Lotto: new LottoDatabaseService(sequelize, StyleLotto),
  ClanMembers: new ClanMemberDatabaseService(sequelize, StyleClanMembers),
});
