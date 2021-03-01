import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import Constants from 'constants';
import { cache } from 'util/runescape/events';

export default class CacheCron extends CronModule {

  constructor() {
    super(Constants.Modules.CRON_CACHE, {});
  }

  load() {
    const job = new CronOptions();
    job.id = `${Constants.Modules.CRON_CACHE}-${Math.random().toString(36).slice(2)}`;
    job.cronTime = '55 */1 * * *';
    job.onTick = () => this.exec(job.id);
    job.onComplete = null;
    job.start = true;
    job.timezone = 'Etc/GMT';
    job.context = null;
    job.runOnInit = false;
    this.add(job);
  }

  async exec(id) {
    super.exec(id);
    try {
      const guilds = this.client.guilds.cache;

      if (guilds) {
        const guildIds = guilds.map((g) => g.id);
        guildIds.forEach(async (e) => {
          const pingChannelId = await this.client.db.ServerSettings.getSettingForServer(e.toString(), 'admin.pingsChannel');
          if (pingChannelId) {
            const pingChannel = this.client.util.resolveChannel(pingChannelId, this.client.channels.cache);
            if (pingChannel) {
              return pingChannel.send(this.client.Dialog('Cache', cache()));
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

}
