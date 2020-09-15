import { Argument, Command } from 'discord-akairo';
import { bestiary } from 'runescape-api'
import { MessageEmbed, Permissions } from 'discord.js';
import go from 'got';
import { Beast } from 'runescape-api/lib/RuneScape';
import _ from 'lodash';
import { commaSeperatedNumbers } from 'util/string';

export default class BeastCommand extends Command {
    constructor() {
        super('beast', {
            aliases: ['beast'],
            channel: 'guild',
            cooldown: 6000,
            ratelimit: 2,
            description: {
                content: 'Display monster stats & info',
                usage: '[beast name]'
            },
            clientPermissions: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.MANAGE_MESSAGES]
        });
    }

    async* args(): Object {
        const x = yield { type: Argument.range('string', 1, 15), match: 'rest', default: null,
            prompt: {
                retry: 'search only 1 word'
            }
        };

        const beastList = await this.getBeastId(x);

        let y = yield {
            type: 'integer',
            match: 'none',
            prompt: {
                start: `Enter a number from the list\n${beastList.str}`,
                retry: 'Number from the list'
            }
        };

        y = beastList.arr[y].id;
        return { x, y };
    }

    async exec(message: Message, { x, y }: args): Promise<Message> {
        const beast = await this.getBeast(y);
        const wiki = await this.getWiki(beast.name);

        return message.channel.send(new MessageEmbed()
            .setTitle(beast.name)
            .setURL(wiki.fullurl)
            .setDescription(wiki.extract)
            .setThumbnail(wiki.original.source)
            .addFields(
                { name: 'Level', value: beast.level, inline: true },
                { name: 'HP', value: commaSeperatedNumbers(beast.lifepoints), inline: true },
                { name: 'XP', value: commaSeperatedNumbers(beast.xp), inline: true },
                { name: 'Aggressive', value: beast.aggressive ? 'Yes' : 'No', inline: true },
                { name: 'Poisonous', value: beast.poisonous ? 'Yes' : 'No', inline: true },
                { name: 'Weakness', value: beast.weakness.name, inline: true },
                { name: 'Stats', value: `Attack: ${beast.attack}\nDefence: ${beast.defence}\nMagic: ${beast.magic}\nRanged: ${beast.ranged}`, inline: true },
                { name: 'Areas', value: beast.areas.length > 0 ? beast.areas.join(', ') : 'N/A', inline: true }
            ).setFooter(beast.members ? 'Members only' : 'Non Members' + ` - ${beast.examine}`)
        )
    }

    async getBeastId(term: string): Object<String, Array<any>> {
        let str = ''; let arr = [];
        await bestiary.getBeastsByTerms(term).then(async data => {
            data.forEach(async (e, i) => {
                if (i <= 21) {
                    arr.push({ id: e.id, name: e.name });
                }
            });
        }).catch(err => console.log(err));
        arr = _.uniqBy(arr, 'name');
        arr.forEach((e, i) => {
           str += `**${i})** ${e.name}\n`;
        });
        return { str, arr };
    }

    async getBeast(id: number) :Beast {
        let obj;
        await bestiary.getBeast(id).then(async data => {
            obj = data;
        }).catch(err => { console.log(err); return 'Cant find?' });
        return obj;
    }

    async getWiki(name: string): Array<any> {
        let body = await go.get(`https://runescape.wiki/api.php?action=query&format=json&prop=extracts%7Cpageimages%7Cinfo&iwurl=1&generator=search&formatversion=2&exsentences=5&exintro=1&explaintext=1&piprop=original&inprop=url&gsrsearch=${encodeURI(name)}&gsrlimit=1`,
            { responseType: 'json', resolveBodyOnly: true }).json();
        return body.query.pages[0]//.original.source;
    }
}
