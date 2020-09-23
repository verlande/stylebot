import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import Constants from 'constants';
import StyleClient from 'client';
import { voiceOfSeren } from 'util/runescape/events';

export default class VoiceOfSerenCron extends CronModule {

  constructor() {
    super(Constants.Modules.CRON_VOICE_OF_SEREN, {});
  }

  load() {
    const job = new CronOptions();
    job.id = `${Constants.Modules.CRON_VOICE_OF_SEREN}-${Math.random().toString(36).slice(2)}`;
    // job.cronTime = '0 0 */1 * * *';
    job.cronTime = '2 */1 * * *';
    // job.cronTime = '*/5 * * * * *';
    job.onTick = () => this.exec(job.id);
    job.onComplete = null;
    job.start = true;
    job.timezone = 'UTC';// process.env.BOT_TIMEZONE;
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
              return pingChannel.send(this.client.dialog('Voice of Seren', await voiceOfSeren()));
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

}
