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
    this.client.logger.info(`Setting '${property}' for server ${server} changed to '${value}'`, {
      event: this.event.toUpperCase(),
    });
  }

}
