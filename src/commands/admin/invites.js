import { Command, Message } from 'discord-akairo';
import { Permissions } from 'discord.js';

export default class InvitesCommand extends Command {
    settings: any;

    constructor() {
        super('invites', {
            aliases: ['invites'],
            description: {
                content: 'Display invites'
            },
            typing: true,
            cooldown: 2000,
            ratelimit: 1,
            channel: 'guild',
            userPermissions: [
                Permissions.FLAGS.ADMINISTRATOR,
            ],
            clientPermissions: Permissions.FLAGS.MANAGE_GUILD
        });
    }

    async exec(message: Message) {
        try {
            await message.guild.fetchInvites().then(async invites => {
                let str = '';
                invites.forEach(inv => {
                    console.log(inv);
                    console.log(inv.url);
                    str += `${inv.url} *used ${inv.uses} times* created by **${inv.inviter.tag}**`
                });
                return message.channel.send(this.client.dialog('List of Invites', str));
            })
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}
