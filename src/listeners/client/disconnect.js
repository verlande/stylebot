import { Listener } from 'discord-akairo';

export default class ClientDisconnectListener extends Listener {

  constructor() {
    super('client:disconnect', {
      emitter: 'client',
      event: 'disconnect',
    });
  }

  exec(info) {
    this.client.logger.warn(info);
    process.exit(1);
  }

}
