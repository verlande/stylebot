import { Listener } from 'discord-akairo'

export default class CooldownListener extends Listener {
    constructor() {
        super('command:cooldown', {
            emitter: 'command',
            event: 'cooldown'
        })
    }

    async exec(message, command, remaining) {
        this.client.logger.info(`[${this.event.toUpperCase()}] ${message.author.tag} tried executing ${command} on cooldown [${remaining.toFixed(2) / 1000}s]`);
        return message.channel.send(new this.client.errorDialog('Cooldown', `You can use \`${command}\` in ${remaining.toFixed(2) / 1000}s`));
    }
}