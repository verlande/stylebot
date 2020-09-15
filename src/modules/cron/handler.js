import { AkairoHandler, AkairoError } from 'discord-akairo';
import CronModule from './index';

export default class CronHandler extends AkairoHandler {
  constructor(client, {
    directory,
    classToHandle = CronModule,
    loadFilter,
    automateCategories,
  }) {
    if (!(classToHandle.prototype instanceof CronModule || classToHandle === CronModule)) {
      throw new AkairoError('INVALID_CLASS_TO_HANDLE', classToHandle.name, CronModule.name);
    }

    super(client, {
      directory,
      classToHandle,
      loadFilter,
      automateCategories,
    });

    this.on('load', (mod) => mod.load(client));
  }
}
