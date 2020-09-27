import { Command, Argument } from 'discord-akairo';
import { Message, Permissions } from 'discord.js';

export default class LottoCommand extends Command {

  constructor() {
    super('lotto', {
      aliases: ['lotto'],
      channel: 'guild',
      description: {
        content: 'Add, remove, list or clear lottery users',
        usage: '[username] [--add|--remove|--list|--clear|--winner]',
        examples: ['', 'mummy603 --add'],
      },
      args: [
        {
          id: 'username',
          type: Argument.range('string', 1, 25),
          match: 'text',
          default: null,
        },
        {
          id: 'add',
          match: 'flag',
          flag: '--add',
        },
        {
          id: 'remove',
          match: 'flag',
          flag: '--remove',
        },
        {
          id: 'list',
          match: 'flag',
          flag: '--list',
        },
        {
          id: 'winner',
          match: 'flag',
          flag: '--winner',
        },
        {
          id: 'clear',
          match: 'flag',
          flag: '--clear',
        },
      ],
      userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
    });
  }

  async before() {
    try {
      this.lottoDb = this.client.db.Lotto;
    } catch (e) {
      console.log(e);
    }
  }

  async exec(message: Message, {
    username, add, remove, list, winner, clear,
  }: args): Promise<Message> {
    await message.delete();

    if (username === null && list) {
      try {
        const entries = await this.getEntries();
        const names = entries.map((x, i) => `**${i})** ${x.name}`);

        //TODO: HARD CODED CHANNEL ID
        const channel = await message.guild.channels.cache.get('750099638303981571');

        if (channel) {
          channel.messages.fetch({ limit: 100 }).then((m) => {
            //TODO: HARD CODED BOT USER ID
            const msgs = m.filter((x) => x.author.id === '748677891721527440' && x.embeds !== null && x.pinned);
            if (msgs.size > 0) {
              msgs.forEach((x) => {
                if (x.embeds[0].title === 'Lotto - Entries List' && x.embeds[0].title !== undefined) {
                  return x.edit(this.client.dialog('Lotto - Entries List', names));
                }
              });
            } else {
              return message.channel.send(this.client.dialog('Lotto - Entries List', names));
            }
          }).catch((err) => console.log(err));
          // return message.channel.send(this.client.dialog('Lotto - Entries List', names));
        }
      } catch (e) {
        console.log(e);
      }
    } else if (username !== null && add) {
      try {
        await this.lottoDb.create({ name: username });
        return message.channel.send(this.client.dialog('Lotto - Add', `Successfully added ${username}`))
          .then((m) => setTimeout(() => m.delete(), 1500));
      } catch (e) {
        console.log(e);
        return message.channel.send(this.client.errorDialog('Error', 'Name is already entered or is longer than 25'))
          .then((m) => setTimeout(() => m.delete(), 3500));
      }
    } else if (username !== null && remove) {
      try {
        await this.lottoDb.destroy({ where: { name: username } });
        return message.channel.send(this.client.dialog('Lotto - Remove', `Removed ${username} from the lotto`))
          .then((m) => setTimeout(() => m.delete(), 1500));
      } catch (e) {
        console.log(e);
      }
    } else if (username === null && winner) {
      try {
        const entries = await this.getEntries();
        const rand = this.getRandomNumber(null, entries.length);
        return message.channel.send(this.client.dialog('Lotto - Winner',
          `The dice landed on **${rand}**, therefore \`${entries[rand].name}\` is the lotto winner! :tada:\n\nOut of ${entries.length} entries`));
      } catch (e) {
        console.log(e);
      }
    } else if (username === null && clear) {
      try {
        await this.lottoDb.destroy({ truncate: true });
        return message.channel.send(this.client.dialog('Lotto - Cleared',
          'Successfully cleared lotto entries')).then((m) => setTimeout(() => m.delete(), 3500));
      } catch (e) {
        console.log(e);
      }
    }
  }

  async getEntries(): Array<String> {
    return await this.lottoDb.getEntries({ attributes: ['name'], raw: true, order: ['createdAt'] });
  }

  getRandomNumber(min = 0, max): Number {
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

}
