import { Listener } from 'discord-akairo';

export default class MissingPermissionsListener extends Listener {
    constructor() {
        super('command:missingPermissions', {
            emitter: 'command',
            event: 'missingPermissions'
        })
    }

    async exec(message: Message, command: Commands, type: string, missing: any) {
        if (type === 'client') {
            let result = missingPermissions(message.guild.me, missing);
            return message.channel.send(this.client.errorDialog('Missing permissions',
                `I do not have the following permission(s): \`${result}\` for the command: \`${command}\``));
        } else if (type === 'user') {
            let result = missingPermissions(message.member, missing);
            return message.channel.send(this.client.errorDialog('Missing Permissions',
                `You do not have the following permission(s): \`${result}\` for the command: \`${command}\``))
        }
    }
}

const missingPermissions = (usr, permissions) => {
    const missingPermissions = usr.permissions.missing(permissions)
        .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

    return missingPermissions.length > 1 ?
        `${missingPermissions.slice(0, -1).join(', ')} and ${missingPermissions.slice(-1)[0]}` :
        missingPermissions[0];
};