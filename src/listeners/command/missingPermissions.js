import { Listener } from 'discord-akairo';

export default class MissingPermissionsListener extends Listener {

  constructor() {
    super('command:missingPermissions', {
      emitter: 'command',
      event: 'missingPermissions',
    });
  }

  missingPermissions(usr, permissions) {
    const missingPermissions = usr.permissions.missing(permissions)
      .map((str) => `\`${str.replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``);

    return missingPermissions.length > 1
      ? `${missingPermissions.slice(0, -1)
        .join(', ')} and ${missingPermissions.slice(-1)[0]}`
      : missingPermissions[0];
  }

  async exec(message: Message, command: Commands, type: string, missing: any) {
    if (type === 'client') {
      const result = this.missingPermissions(message.guild.me, missing);
      return message.channel.send(this.client.ErrorDialog('Missing permissions',
        `I do not have the following permission(s): \`${result}\` for the command: \`${command}\``));
    }
    if (type === 'user') {
      const result = this.missingPermissions(message.member, missing);
      return message.channel.send(this.client.ErrorDialog('Missing Permissions',
        `You do not have the following permission(s): \`${result}\` for the command: \`${command}\``));
    }
  }

}
