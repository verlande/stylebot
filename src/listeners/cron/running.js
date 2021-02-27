import { Listener } from 'discord-akairo';
import Constants from 'constants';

export default class CronRunningListener extends Listener {

  constructor() {
    super(Constants.Events.CRON_RUNNING, {
      emitter: 'cron',
      event: Constants.Events.CRON_RUNNING,
    });
  }

  exec(id) {
    this.client.loggers.cron.info(`CronJob '${id}' running`, { event: 'CRONJOB' });
  }

}
