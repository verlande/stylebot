import { Command } from 'discord-akairo';
import { DateTime } from 'luxon';
import * as JFT from 'util/jft';

export default class JustForTodayCommand extends Command {

  constructor() {
    super('jft', {
      aliases: ['jft'],
      channel: 'guild',
      description: {
        content: 'Sends you todays Just For Today reading.',
      },
      typing: true,
      cooldown: 5000,
      ratelimit: 1,
    });
  }

  before() {
    this.db = this.client.db.ServerSettings;
  }

  async exec(message: Message): Promise<Message> {
    try {
      const timezone = (await this.db.getSettingForServer(message.guild.id, 'timezone')) || 'GMT';
      const date = DateTime.local().setZone(timezone);
      const jft = JFT.getForDate(date);
      return message.channel.send(
        JFT.getDialog(this.client.Dialog(null), jft),
      );
    } catch (e) {
      this.client.logger.error(e);
    }
  }

}
