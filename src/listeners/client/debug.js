import { Listener } from 'discord-akairo';

export default class DebugListener extends Listener {
  constructor() {
    super('client:debug', {
      emitter: 'client',
      event: 'debug',
    });
  }

  exec(info: String) {
    this.client.loggers.debug.debug(info);
  }
  
}
