import { Command, Argument } from 'discord-akairo';
import { Message, Permissions, MessageEmbed } from 'discord.js';
import { sample } from 'lodash';

export default class LottoCommand extends Command {
    constructor() {
        super('lotto', {
            aliases: ['lotto'],
            channel: 'guild',
            description: {
                content: 'Add, remove or list lottery users',
                usage: '[username] [--add|--remove|--list|--clear]',
                examples: ['', 'mummy603 --add']
            },
            args: [
                {
                    id: 'username',
                    type: Argument.range('string', 1, 12),
                    match: 'text',
                    default: null,
                },
                {
                    id: 'add',
                    match: 'flag',
                    flag: '--add'
                },
                {
                    id: 'remove',
                    match: 'flag',
                    flag: '--remove'
                },
                {
                    id: 'list',
                    match: 'flag',
                    flag: '--list'
                },
                {
                    id: 'winner',
                    match: 'flag',
                    flag: '--winner',
                },
                {
                    id: 'clear',
                    match: 'flag',
                    flag: '--clear'
                }
            ],
            userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
        });
    }

    before(message: Message): Promise<Message> {
        this.lottoDb = this.client.db.Lotto;
    }

    async exec(message: Message, { username, add, remove, list, winner, clear }: args): Promise<Message> {
        await message.delete();
        if (username === null && list) {
            try {
                const entries = await this.lottoDb.getEntries({ attributes: ['name'], raw: true, order: ['createdAt'] });

                let names = '';
                entries.forEach((e, i) => { names += `**${i})** ${e.name}\n`; });

                return message.channel.send(this.client.dialog('Lotto - Entries List', names));

            } catch (e) {
                console.log(e);
            }
        } else if (username !== null && add) {
            try {
                await this.lottoDb.create({ name: username });
                return message.channel.send(this.client.dialog('Lotto - Add', `Successfully added ${username}`))
                    .then(m => setTimeout(() => m.delete(), 1500));
            } catch (e) {
                console.log(e);
                return message.channel.send(this.client.errorDialog('Error', 'Name is already entered'));
            }
        } else if (username !== null && remove) {
            try {
                await this.lottoDb.destroy({ where: { name: username }});
                return message.channel.send(this.client.dialog('Lotto - Remove', `Removed ${username} from the lotto`))
                    .then(m => setTimeout(() => m.delete(), 1500));
            }
            catch (e) {
                console.log(e);
            }
        } else if (username === null && winner) {
            try {
                const entries = await this.lottoDb.getEntries({attributes: ['name'], raw: true});

                return message.channel.send(this.client.dialog('Lotto - Winner',
                    `${sample(entries).name} is the lotto winner!\n\nOut of ${entries.length} entries`));
            }
            catch (e) {
                console.log(e);
            }
        } else if (username === null && clear) {
            try {
                await this.lottoDb.destroy({ truncate: true });
                return message.channel.send(this.client.dialog('Lotto - Winner',
                    'Successfully cleared lotto entries'));
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}
