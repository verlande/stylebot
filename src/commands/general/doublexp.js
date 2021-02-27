import { Command } from 'discord-akairo';
import cheerio from 'cheerio';
import go from 'got';

export default class DoubleXpCommand extends Command {

  constructor() {
    super('doublexp', {
      aliases: ['dxpw'],
      channel: 'guild',
      cooldown: 10000,
      description: {
        content: 'Double XP clan gains',
      },
      typing: true,
    });
  }

  async exec(message: Message): Promise<Message> {
    const usernames = [];
    const xp = [];
    await go('https://runeclan.com/clan/style').then(async (response) => {
      const $ = cheerio.load(response.body);
      const html = $('.box').eq(-2).html();
      const clanScores = html.match(/getClanScoresDxp.\d+/gm);
      const apiId = clanScores[0].match(/\d+/gs);

      go(`https://www.runeclan.com/external/grab.php?id=${apiId[0]}`).then((res) => {
        const $ = cheerio.load(res.body);
        const children = $('tbody').children('tr').children('td');
        children.each((i, el) => {
          if (el.children[0].data !== undefined) xp.push(el.children[0].data);
        });
        children.children('a').each((i, el) => {
          usernames.push(el.children[0].data);
        });
        const arr = [];
        for (let i = 0; i < xp.length; i++) {
          if (i % 2 !== 0) arr.push(xp[i]);
        }
        let str = '';
        usernames.map((x, i) => { const j = i + 1; str += `**${j})** *${x}* - ${arr[i]} XP\n`; });
        return message.channel.send(this.client.dialog('Double XP Clan Gains', str));
      });
    }).catch((err) => { console.log(err); message.channel.send(this.client.errorDialog('Error', 'Something happened')); });
  }

}
