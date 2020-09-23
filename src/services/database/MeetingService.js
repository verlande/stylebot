import DatabaseService from 'services/database/DatabaseService';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

export default class MeetingDatabaseService extends DatabaseService {

  async getForDate(sources: Array<int>, date: DateTime = DateTime.local()) {
    const meetings = await this.findAll({
      where: {
        sourceService: {
          [Op.or]: sources,
        },
        weekday: date.weekday,
      },
    });

    return meetings;
  }

}
