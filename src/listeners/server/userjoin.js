import { GuildMember } from 'discord.js';
import { Listener } from 'discord-akairo';


export default class UserJoin extends Listener {
    constructor() {
        super('client:userJoin', {
            emitter: 'client',
            event: 'guildMemberAdd'
        })
    }

    async exec(member: GuildMember) {
        this.client.logger.info(`[${this.event.toUpperCase()}] ${member.user.tag} has joined ${member.guild.name} (ID: ${member.guild.id})`);

        try {
            const joinType = await this.client.db.ServerSettings.getSettingForServer(member.guild.id, 'admin.joinType');
            if (joinType === 'guild') {
                const joinMessage = await this.client.db.ServerSettings.getSettingForServer(member.guild.id, 'admin.joinMessage');
                const welcomeChannel = await this.client.db.ServerSettings.getSettingForServer(member.guild.id, 'admin.joinLeaveChannel');
                const channel = await member.guild.channels.cache.get(welcomeChannel);
                return await channel.send(joinMessage.replace(/%user%/gi, `<@${member.user.id}>`));
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}