import {Command, Message} from 'discord-akairo';
import {Permissions} from 'discord.js';
import {get, set} from 'lodash';

export default class SettingsCommand extends Command {
    settings: any;

    constructor() {
      super('settings', {
        aliases: ['settings', 'set'],
        description: {
          content: 'View or set settings for server/guild.',
          usage: '[property] [value]',
          examples: [
            'settings admin.joinType [dm|guild]',
            'settings admin.joinMessage [on user join message]',
          ],
        },
        typing: true,
        cooldown: 5000,
        ratelimit: 1,
        channel: 'text',
        userPermissions: [
          Permissions.FLAGS.MANAGE_GUILD
        ],
      });
    }

    * args() {

      const getType = (property) => {
        switch (property) {
          case 'admin.botChannel':
          case 'admin.joinLeaveChannel':
          case 'admin.pingsChannel':
            return 'textChannel';
          case 'timezone':
          case 'admin.joinType':
              return ['dm', 'guild'];
          case 'admin.joinMessage':
          case 'admin.leaveMessage':
            return 'string';
/*          case 'meeting.reminders':
          case 'jftCron.enabled':
            return ['true', 'false'];
          case 'jftCron.channels':
            return (message, phrase) => {
                return phrase.split(',').map(c => {
                  const channel = this.client.util.resolveChannel(c, this.client.channels.cache);
                  if (channel)
                      return channel.id;
              }).filter(c => c !== undefined);
            };*/
          default:
            return 'string'
        }
      };

      const property = yield { id: 'property', type: 'string' };
      const value = yield { id: 'value', match: 'rest', type: getType(property) };

      return {
        property,
        value,
      };
    }

    async before(message: Message) {
      try {
        this.db = this.client.db.ServerSettings;
        this.settings = (await this.db.getSettingsForServer(message.guild.id)).get('settings');
      } catch (e) {
        this.client.logger.error(e);
      }
    }

    async exec(message: Message, { property, value }: args) {
      try {
        if (value && typeof value === 'object' && value.type === 'text')
          value = value.id;

        if (!property) {
          return this.displayAll(message);
        }

        if (property && !value) {
          return this.displaySingle(message, property);
        }

        if (property && value && this.db.getSettingsPaths(this.settings).includes(property)) {
          value = (value === 'true' || value === 'false') ? (value === 'true') : value;
          return await this.updateSingle(message, property, value);
        }

        return this.displayError(message, `Unable for find property with name \`${property}\``);
      } catch (e) {
        this.client.logger.error(e);
      }
    }

    displayAll(message: Message) {
      try {
        const { prefix } = this.client.handlers.command;
        const primaryPrefix = Array.isArray(prefix) ? prefix[0] : prefix;

        const values = this.db.getSettingsPaths(this.settings)
          .map((path) => `  "${path}": ${JSON.stringify(get(this.settings, path))},`);

        return message.channel.send(
          this.client.dialog(
            'Server Settings',
            [
              `*${message.guild.name} (ID: ${message.guild.id})*`,
              ' ',
              `For help on how to change these settings, use **${primaryPrefix}help settings [setting]**`,
              '```json',
              '{',
              ...values,
              '}',
              '```',
            ],
          ),
        );
      } catch(e) {
        return this.displayError(
          message,
          e
        );
      }
    }

    displaySingle(message: Message, property: String) {
      if (this.db.getSettingsPaths(this.settings).includes(property)) {
        return message.channel.send(`The setting \`${property}\` is currently set to \`${JSON.stringify(get(this.settings, property))}\`.`);
      }

      return this.displayError(
        message,
        `The setting \`${property}\` doesn't exist, perhaps you typed it incorrectly?`
      );
    }

    async updateSingle(message: Message, property: String, value: any) {
      try {
        await this.db.setSettingForServer(message.guild.id, property, value);
        return message.channel.send(`The setting \`${property}\` has been updated, it is now \`${value}\`.`);
      } catch(e) {
        return this.displayError(
          message,
          e.message,
        );
      }
    }

    displayError(message, content: String = "Unknown error.") {
      return message.channel.send(
        this.client.errorDialog(
          'Error',
          content
        )
      );
    }
}
