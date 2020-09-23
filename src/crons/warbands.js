import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import Constants from 'constants';
import StyleClient from 'client';
import { warbands } from 'util/runescape/events';

export default class WarbandsCron extends CronModule {

  constructor() {
    super(Constants.Modules.CRON_WARBANDS, {});
  }

  load() {
    const job = new CronOptions();
    job.id = `${Constants.Modules.CRON_WARBANDS}-${Math.random().toString(36).slice(2)}`;
    job.cronTime = '50 */1 * * *';
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
        if (warbands()[0] < 1) {
          const guildIds = guilds.map((g) => g.id);
          guildIds.forEach(async (e) => {
            const pingChannelId = await this.client.db.ServerSettings.getSettingForServer(e.toString(), 'admin.pingsChannel');
            if (pingChannelId) {
              const pingChannel = this.client.util.resolveChannel(pingChannelId, this.client.channels.cache);
              if (pingChannel) {
                return pingChannel.send(this.client.dialog('Warbands', 'The next Warband is about to begin!'));
              }
            }
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

}
