import { Listener } from 'discord-akairo';
import Constants from 'constants';

export default class CronRemovedListener extends Listener {

  constructor() {
    super(Constants.Events.CRON_REMOVED, {
      emitter: 'cron',
      event: Constants.Events.CRON_REMOVED,
    });
  }

  exec(id) {
    this.client.logger.info(`CronJob '${id}' removed`, { event: 'CRONJOB' });
  }

}
