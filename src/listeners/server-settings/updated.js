import { Listener } from 'discord-akairo';
import Constants from 'constants';

export default class ServerSettingsUpdatedListener extends Listener {

  constructor() {
    super(Constants.Events.SERVER_SETTING_UPDATED, {
      emitter: 'serverSettings',
      event: Constants.Events.SERVER_SETTING_UPDATED,
    });
  }

  exec(server, property, value) {
    this.client.logger.info(`Setting '${property}' for server ${server} changed to '${value}'`);
    if (property.includes('jftCron.')) {
      const m = this.client.handlers.cron.modules.get(Constants.Modules.CRON_JFT);
      m.destroyAll();
      m.reload();
    }
    if (property.includes('meeting.')) {
      const m = this.client.handlers.cron.modules.get(Constants.Modules.CRON_MEETING_REMINDER);
      m.destroyAll();
      m.reload();
    }
  }
}
