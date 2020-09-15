import { Listener } from 'discord-akairo';

export default class ProcessUnhandledRejectionListener extends Listener {
    constructor() {
        super('process:unhandled-rejection', {
            eventName: 'unhandledRejection',
            emitter: 'process'
        });
    }

    exec(error) {
        this.client.logger.error(error);
    }
}