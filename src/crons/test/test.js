import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import { clan } from 'runescape-api';
import Constants from 'constants';
import StyleClient from 'client';
import { findIndex } from 'lodash';

export default class NewMemberCron extends CronModule {

  constructor() {
    super(Constants.Modules.CRON_NEW_MEMBER, {});
  }

  load() {
    const job = new CronOptions();
    job.id = `${Constants.Modules.CRON_NEW_MEMBER}-${Math.random().toString(36).slice(2)}`;
    // job.cronTime = '0 0 */1 * * *';
    job.cronTime = '*/60 * * * *';
    job.onTick = () => this.exec(job.id);
    job.onComplete = null;
    job.start = true;
    job.timezone = process.env.BOT_TIMEZONE;
    job.context = null;
    job.runOnInit = true;// TODO: enable once in prod

    this.add(job);
  }

  async exec(id) {
    super.exec(id);
    const members = await this.client.db.ClanMembers.getAllMemebers();
    await clan.getMembers('Style').then(async (data) => {
      data.forEach(async (e) => {
        const index = findIndex(members, (i) => e.name === i.name);
        if (index === -1 && e.rank === 'Recruit') {
          try {
            await this.client.db.ClanMembers.addClanMember(e.name);

            await new Promise((resolve) => {
              (function waitForCache() {
                if (this.client.channels.cache.size > 0) return resolve();
                setTimeout(() => waitForCache.call(this), 10);
              }).call(this);
            });

            // TODO: put this in settings at some point
            const announceChannel = this.client.util.resolveChannel('754015628599361647', this.client.channels.cache);
            if (announceChannel) {
              const message = await this.client.db.ServerSettings.getSettingForServer(announceChannel.guild.id, 'admin.clanJoinMessage');
              announceChannel.send(this.client.Dialog('New Clan Member!', message.replace(/%user%/gi, `**${e.name}**`)));
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    }).catch((err) => this.client.logger.error(err));
  }

}
