import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import Constants from 'constants';
import StyleClient from 'client';

export default class SinkholeCron extends CronModule {
  constructor() {
    super(Constants.Modules.CRON_SINKHOLE, {});
  }

  load(client: StyleClient) {
    const job = new CronOptions();
    job.id = `${Constants.Modules.CRON_SINKHOLE}-${Math.random().toString(36).slice(2)}`;
    //job.cronTime = '0 0 */1 * * *';
    job.cronTime = '25 */1 * * *';
    //job.cronTime = '*/50 * * * * *';
    job.onTick = () => this.exec(job.id);
    job.onComplete = null;
    job.start = true;
    job.timezone = process.env.BOT_TIMEZONE;
    job.context = null;
    job.runOnInit = false;

    this.add(job);
  }

  async exec(id) {
    super.exec(id);
    try {
      const guilds = this.client.guilds.cache;

      if (guilds) {
        const guildIds = guilds.map(g => g.id);
        guildIds.forEach(async(e, i) => {
          let pingChannelId = await this.client.db.ServerSettings.getSettingForServer(e.toString(), 'admin.pingsChannel');
          if (pingChannelId) {
            let pingChannel = this.client.util.resolveChannel(pingChannelId, this.client.channels.cache);
            if (pingChannel) {
              return pingChannel.send(this.client.dialog('Sinkhole', 'A sinkhole is about to start!'));
            }
          }
        });
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}
