import { Listener } from 'discord-akairo';
import Constants from 'constants';

export default class CronFinishedListener extends Listener {
    constructor() {
        super(Constants.Events.CRON_FINISHED, {
            emitter: 'cron',
            event: Constants.Events.CRON_FINISHED
        });
    }

    exec(id) {
        this.client.logger.info(`CronJob '${id}' finished running`, { event: 'CRONJOB' });
    }
}
