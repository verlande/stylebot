// import { Command } from 'discord-akairo';
// import go from 'got';
// import cheerio from 'cheerio';
//
// export default class VisWaxCommand extends Command {
//     constructor() {
//         super('viswax', {
//             aliases: ['viswax'],
//             channel: 'guild',
//             description: {
//                 content: 'Displays vis wax combos'
//             },
//         })
//     }
//
//     async exec(message: Message): Promise<Message> {
//         await go('https://warbandtracker.com/goldberg/index.php').then(response => {
//             const $ = cheerio.load(response.body);
//             let first = '', second = '';
//
//             $('tbody').children('tr').children('td').children('div').each((i, elem) => {
//                 let percentage = elem.children[0].data;
//                 let rune = $('img')[i].attribs.title;
//                 if (i < 4) {
//                     first += `${rune} ${percentage}\n`;
//                     //first.push(parsed);
//                 } else {
//                     //second.push(parsed);
//                     //second += `${rune} ${percentage}\n`;
//                 }
//             });
//             return message.channel.send(this.client.dialog('Vis Wax Combos')
//                 .addField('First', first, true))//.addField('Second', second, true));
//         });
//     }
// }
