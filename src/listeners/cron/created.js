import { Listener } from 'discord-akairo';
import Constants from 'constants';

export default class CronCreatedListener extends Listener {

  constructor() {
    super(Constants.Events.CRON_CREATED, {
      emitter: 'cron',
      event: Constants.Events.CRON_CREATED,
    });
  }

  exec(id, cronTime) {
    this.client.loggers.cron.info(`'${id}' created with cronTime ${cronTime}`, { event: 'CRONJOB' });
  }

}
