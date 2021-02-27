import {
  AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler,
} from 'discord-akairo';
import Constants from 'constants';
import { Message, StringResolvable } from 'discord.js';
import StyleError from 'models/StyleError';
import Logger from 'util/logger';
import CronHandler from 'modules/cron/handler';
import { create } from 'database';

const db = create();

export default class StyleClient extends AkairoClient {

    Error: StyleError = StyleError;

    db: any = db;
    logger: Logger = new Logger().logger;
    loggers: Logger = new Logger().loggers;
    config: Object = {};
    dialog: Function = (title: string, description: StringResolvable = '') => this.util.embed()
      .setColor(Constants.Colors.DEFAULT)
      .setThumbnail(this.logo)
      .setTitle(title)
      .setDescription(description);
    errorDialog: Function = (title: string, description: StringResolvable = '') => this.util.embed()
      .setColor(Constants.Colors.RED)
      .setTitle(title)
      .setDescription(description);
    handlers: Object = {
      command: new CommandHandler(this, {
        allowMention: true,
        ignoreCooldown: ['323208710401032194'], // TODO: Take ownerID from .env
        ignorePermissions: ['323208710401032194'],
        automateCategories: true,
        commandUtil: true,
        blockBots: true,
        blockClient: true,
        prefix: ['`', '£'],
        directory: `${__dirname}/commands`,
        argumentDefaults: {
          prompt: {
            cancel: (msg: Message) => `${msg.author}, command cancelled.`,
            ended: (msg: Message) => `${msg.author}, command declined.`,
            modifyRetry: (msg, text) => text && `${msg.author}, ${text}\n\nType \`cancel\` to cancel this command.`,
            modifyStart: (msg, text) => text && `${msg.author}, ${text}\n\nType \`cancel\` to cancel this command.`,
            retries: 3,
            time: 30000,
            timeout: (msg: Message) => `${msg.author}, command expired.`,
          },
        },
      }),
      inhibitor: new InhibitorHandler(this, {
        automateCategories: true,
        directory: `${__dirname}/inhibitors`,
      }),
      listener: new ListenerHandler(this, {
        automateCategories: true,
        directory: `${__dirname}/listeners`,
      }),
      cron: new CronHandler(this, {
        automateCategories: true,
        directory: `${__dirname}/crons`,
      }),
    }

    constructor(config: Object = {}) {
      super({
        ownerID: /* config.owners || */['323208710401032194'],
      }, {
        messageCacheLifetime: 300,
        messageCacheMaxSize: 35,
        disabledEvents: [
          'TYPING_START',
          'CHANNEL_PINS_UPDATE',
          'GUILD_BAN_ADD',
          'GUILD_BAN_REMOVE',
          // 'MESSAGE_DELETE',
          'MESSAGE_DELETE_BULK',
          'RESUMED',
          'WEBHOOKS_UPDATE',
        ],
        disableEveryone: true,
      });

      this.config = config;
      this.logo = 'https://cdn.daddycool.rocks/$web/assets/images/stylebot_thumbnail.png';
    }

    build() {
      this.handlers.command
        .useInhibitorHandler(this.handlers.inhibitor)
        .useListenerHandler(this.handlers.listener);

      this.handlers.listener
        .setEmitters({
          command: this.handlers.command,
          inhibitor: this.handlers.inhibitor,
          listener: this.handlers.listener,
          cron: this.handlers.cron,
          serverSettings: this.db.ServerSettings,
          process,
        });

      this.handlers.command.loadAll();
      this.handlers.listener.loadAll();
      this.handlers.inhibitor.loadAll();
      this.handlers.cron.loadAll();

      return this;
    }

    async start() {
      try {
        const force = ['-f', '--force'].some((f) => process.argv.includes(f));
        await this.db.sequelize.sync({ force });

        return this.login(this.config.token);
      } catch (e) {
        console.log('err', e);
      }
    }

}
