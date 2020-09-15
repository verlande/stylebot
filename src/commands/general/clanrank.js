import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import cheerio from 'cheerio';
import go from 'got';
import Constants from 'constants';

export default class ClanRankCommand extends Command {
    constructor() {
        super('clanrank', {
            aliases: ['clanrank', 'crank'],
            channel: 'guild',
            cooldown: 20000,
            description: {
                content: 'Clan XP Rankings'
            },
            typing: true
        })
    }

    async exec(message: Message): Promise<Message> {
        await go('https://runeclan.com/clan/style').then(async response => {
            if (response.statusCode !== 200) {
                return message.channel.send(this.client.errorDialog('Error', 'Something happened try again later'))
            }

            const $ = cheerio.load(response.body);
            let rank = [], xpGain = [], tempArr = [];

            $('tr').children('td').each((i, elem) => {
                if (elem.children[0].data !== undefined) {
                    tempArr.push(elem.children[0].data)
                }
            });

            tempArr.forEach((i) => {
                if (i % 1 === 0) rank.push(i);
                else if (i % 1 !== 0) xpGain.push(i)
            });

            return message.channel.send(this.client.dialog('Style Clan Rankings')
                .addField('Today', `Rank: ${rank[0]}\nXP: ${xpGain[0]}`)
                .addField('Yesterday', `Rank: ${rank[1]}\nXP: ${xpGain[1]}`)
                .addField('Week', `Rank: ${rank[2]}\nXP: ${xpGain[2]}`)
                .addField('Month', `Rank: ${rank[3]}\nXP: ${xpGain[3]}`)
            );
        }).catch(err => {
            this.client.logger.error(err);
            return message.channel.send(this.client.errorDialog('Error', 'Something happened'));
        })
    }
}