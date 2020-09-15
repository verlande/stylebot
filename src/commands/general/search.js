import { Command, Argument } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { commaSeperatedNumbers } from 'util/string'
import { clan } from 'runescape-api'
import go from 'got'

export default class SearchCommand extends Command {
    constructor() {
        super('search', {
            aliases: ['search'],
            channel: 'guild',
            cooldown: 6000,
            typing: true,
            description: {
                usage: 'search <username>',
                examples: ['search mummy603'],
                content: 'Search a player in the clan'
            },
            args: [
                {
                    id: 'username',
                    type: Argument.range('string', 1, 12),
                    match: 'content',
                    default: null
                }
            ]
        })
    }

    before(message: Message): any {
        this.userDb = this.client.db.User;
    }

    async exec(message, { username }: args): Promise<Message> {
        username = username ? username : await this.userDb.getRSN(message.author.id);

        try {
            clan.getMembers('Style').then(data => {
                data.forEach(element => {
                    if (element.name.toLowerCase() === username.toLowerCase()) {
                        (async () => {
                            const {body} = await go.get(`https://apps.runescape.com/runemetrics/profile/profile?user=${encodeURI(username)}&activities=4`,
                                {
                                    responseType: 'json'
                                });

                            let embed = new MessageEmbed()
                                .setTitle(`Clan member ${element.name}`)
                                .setThumbnail(`https://secure.runescape.com/m=avatar-rs/${encodeURI(username)}/chat.png`)
                                .addField('Rank', element.rank, true)
                                .addField('Kills', element.kills, true)
                                .setFooter(`Requested by ${message.author.tag}`);

                            if (body.error !== 'PROFILE_PRIVATE') {
                                let oneTwentys = 0;
                                body.skillvalues.forEach(e => {
                                    if (e.level >= 120)
                                        oneTwentys++
                                });

                                let activity = '';

                                body.activities.forEach(e => {
                                    activity += `${e.date}\n${e.text}\n\n`
                                });

                                embed.addField('XP', commaSeperatedNumbers(body.totalxp), true)
                                    .addField('Total', body.totalskill, true)
                                    .addField('Quests Completed', `${body.questscomplete}/${body.questscomplete + body.questsnotstarted}`, true)
                                    .addField('120\'s', oneTwentys, true)
                                    .addField('Activity', '```\n' + activity + '\n```');

                                return message.channel.send({embed});
                            } else if (body.error === 'PROFILE_PRIVATE') {
                                return message.channel.send(this.client.errorDialog('Error', 'Profile private'));
                            }
                        })();
                    }
                });
                //return message.channel.send(this.client.dialog('Search', 'Not a clan member?'));
            })
        }
        catch (e) {
            this.client.logger.error(e);
        }
    }
}
