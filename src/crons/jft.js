// import { Command } from 'discord-akairo';
// import CronModule from 'modules/cron';
// import CronOptions from 'models/CronOptions';
// import * as JFT from 'util/jft';
// import Constants from 'constants';
// import StyleClient from 'client';
// import { DateTime } from 'luxon';
//
// export default class JustForTodayCron extends CronModule {
//
//     constructor() {
//         super(Constants.Modules.CRON_JFT, {});
//     }
//
//     async load(client: StyleClient) {
//         const servers = await client.db.Server.findAll({
//             include: [client.db.sequelize.models.StyleServerSettings]
//         });
//
//         servers.forEach(server => {
//             const { id, settings } = server.get('settings').get();
//             if (
//                 settings.jftCron.enabled &&
//                 settings.jftCron.channels.length >= 1 &&
//                 settings.jftCron.time
//             ) {
//                 const job = new CronOptions();
//                 job.id = `${Constants.Modules.CRON_JFT}-${id}-${Math.random().toString(36).slice(2)}`;
//                 job.cronTime = settings.jftCron.time;
//                 job.onTick = () => this.exec(job.id, settings.timezone, settings.jftCron.channels);
//                 job.onComplete = null;
//                 job.start = true;
//                 job.timezone = settings.timezone;
//                 job.context = null;
//                 job.runOnInit = false;
//
//                 this.add(job);
//             }
//         });
//     }
//
//     async exec(id, timezone, channels) {
//         super.exec(id);
//         try {
//             const date = DateTime.local().setZone(timezone);
//             const jft = JFT.getForDate(date);
//
//             await new Promise((resolve, reject) => {
//                 (function waitForCache() {
//                     if (this.client.channels.cache.size > 0) return resolve();
//                     setTimeout(() => waitForCache.call(this), 10);
//                 }).call(this);
//             });
//
//             channels.forEach(channel => {
//                 const match = this.client.util.resolveChannel(channel, this.client.channels.cache);
//                 if (match) {
//                     match.send(
//                         JFT.getDialog(this.client.dialog(null), jft),
//                     )
//                 }
//             });
//         } catch (e) {
//             this.client.logger.error(e.message);
//         }
//     }
// }
