import { Listener } from 'discord-akairo';

export default class ProcessUnhandledPromiseRejectionListener extends Listener {

  constructor() {
    super('process:unhandled-promise-rejection', {
      eventName: 'unhandledPromiseRejection',
      emitter: 'process',
    });
  }

  exec(error) {
    this.client.logger.error(error);
  }

}
