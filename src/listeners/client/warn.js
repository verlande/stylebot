import { Listener } from 'discord-akairo';

export default class ClientWarnListener extends Listener {

  constructor() {
    super('client:warn', {
      emitter: 'client',
      event: 'warn',
    });
  }

  exec(info) {
    this.client.logger.warn(info);
  }

}
