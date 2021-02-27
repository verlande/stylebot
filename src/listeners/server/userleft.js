import { GuildMember, Message } from 'discord.js';
import { Listener } from 'discord-akairo';


export default class UserLeft extends Listener {

  constructor() {
    super('client:userleft', {
      emitter: 'client',
      event: 'guildMemberRemove',
    });
  }

  async exec(member: GuildMember): Promise<Message> {
    this.client.loggers.joinLeave.info(`${member.user.tag} has left ${member.guild.name} (ID: ${member.guild.id})`, {
      event: this.event.toUpperCase(),
      userId: member.user.id,
      username: member.user.tag,
      nickname: member.nickname,
      roles: member.roles.cache.map((x) => x.name),
      guildName: member.guild.name,
      guildId: member.guild.id,
    });

    try {
      const joinType = await this.client.db.ServerSettings.getSettingForServer(member.guild.id, 'admin.joinType');
      if (joinType === 'guild') {
        const leaveMessages = await this.client.db.ServerSettings.getSettingForServer(member.guild.id, 'admin.leaveMessages');
        const welcomeChannel = await this.client.db.ServerSettings.getSettingForServer(member.guild.id, 'admin.joinLeaveChannel');
        const channel = await member.guild.channels.cache.get(welcomeChannel);

        const leaveMessage = leaveMessages[Math.floor(Math.random() * (Math.ceil(leaveMessages.length)))];

        return await channel.send(leaveMessage.replace(/%user%/gi, `<@${member.user.id}> (${member.user.tag})`));
      }
    } catch (e) {
      console.log(e);
    }
  }

}
