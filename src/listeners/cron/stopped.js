import { Listener } from 'discord-akairo';
import Constants from 'constants';

export default class CronStoppedListener extends Listener {

  constructor() {
    super(Constants.Events.CRON_STOPPED, {
      emitter: 'cron',
      event: Constants.Events.CRON_STOPPED,
    });
  }

  exec(id) {
    this.client.logger.info(`CronJob '${id}' stopped running`, { event: 'CRONJOB' });
  }

}
