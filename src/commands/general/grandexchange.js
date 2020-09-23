import { Command } from 'discord-akairo';
import { rs } from 'util/runescape/api';
import { commaSeperatedNumbers } from 'util/string';
import * as vega from 'vega';
import sharp from 'sharp';
import { MessageAttachment, Message } from 'discord.js';
import * as vl from 'vega-lite';
import go from 'got';
import spec from '../../static/specs/grandexchange';

export default class GrandExchangeCommand extends Command {

  constructor() {
    super('grandexchange', {
      aliases: ['ge'],
      channel: 'guild',
      args: [
        {
          id: 'item',
          type: 'string',
          match: 'content',
          default: null,
        },
      ],
      description: {
        content: 'Price check items',
        usage: '[item name]',
      },
    });

    this.nonMemebers = 'https://runescape.wiki/images/d/d2/F2P_icon.png?669c3';
    this.members = 'https://runescape.wiki/images/0/02/P2P_icon.png?d1bb2';
    this.arrowUp = ':arrow_up:';
    this.arrowDown = ':arrow_down:';
    this.milo = 'https://media.discordapp.net/attachments/750302710988931092/750803127476813844/image0.jpg';
  }

  async exec(message: Message, { item }: args): Promise<Message> {
    const msg = message.channel.send(this.client.dialog('Grand Exchange', 'sending milo to retrieve the item for you\nwill be back shortly')
      .setImage(this.milo).setThumbnail(null));

    const itemData = await this.getItem(item);

    if (itemData === null) {
      msg.then((m) => setTimeout(() => {
        m.edit(this.client.errorDialog('Error', 'milo came back empty handed try again :face_with_monocle:\nbe more specific!!')
          .setImage(this.milo)
          .setThumbnail(null));
      }, 2250));
      return msg.then((m) => setTimeout(() => { m.delete(); }, 6000));
    }

    const extract = await this.getExtract(itemData.information.item.name);
    const graphData = await this.getGraph(itemData.itemId);
    let str = '';

    const change = itemData.information.item;
    if (change.day30.trend === 'positive') str += `30D ${change.day30.change} ${this.arrowUp}\n`;
    if (change.day30.trend === 'neutral') str += '30D N/C\n';
    if (change.day30.trend === 'negative') str += `30D ${change.day30.change} ${this.arrowDown}\n`;
    if (change.day90.trend === 'neutral') str += '90D N/C\n';
    if (change.day90.trend === 'positive') str += `90D ${change.day90.change} ${this.arrowUp}\n`;
    if (change.day90.trend === 'negative') str += `90D ${change.day90.change} ${this.arrowDown}\n`;
    if (change.day180.trend === 'positive') str += `180D ${change.day180.change} ${this.arrowUp}\n`;
    if (change.day180.trend === 'negative') str += `180D ${change.day180.change} ${this.arrowDown}\n`;
    if (change.day180.trend === 'neutral') str += '180D N/C\n';

    spec.title.text = itemData.information.item.name.toUpperCase();
    spec.data.values = graphData;

    const vegaSpec = vl.compile(spec).spec;
    const view = new vega.View(vega.parse(vegaSpec), { renderer: 'none' });
    await view.toSVG().then(async (svg) => {
      svg = svg.replace(/G(?=[^G]*\.)/gs, 'B');
      const buffer = await sharp(Buffer.from(svg))
        .toFormat('png')
        .toBuffer();
      const fileName = `${Date.now()}.png`;
      const attachment = new MessageAttachment(buffer, fileName);

      msg.then((m) => setTimeout(() => { m.delete(); }, 1000));

      return message.channel.send(this.client.dialog(itemData.information.item.name, extract.extract)
        .addFields(
          {
            name: 'Price',
            value: `${commaSeperatedNumbers(itemData.price)} GP`,
            inline: true,
          },
          {
            name: 'Buy Limit',
            value: `${commaSeperatedNumbers(itemData.limit)}`,
            inline: true,
          },
          {
            name: 'Change',
            value: `${str}`,
            inline: false,
          },
        )
        .attachFiles(attachment)
        .setImage(`attachment://${attachment.name}`)
        .setURL(`https://runescape.wiki/w/${encodeURI(itemData.item)}`)
        .setThumbnail(itemData.information.item.icon_large)
        .setFooter(itemData.information.item.members === 'true' ? 'Members' : 'Non Members',
          itemData.information.item.members === 'true' ? this.members : this.nonMemebers));
    });
  }

  async getItem(item: String) {
    let data;
    await rs.ge.getItem(item)
      .then(async (item) => {
        await rs.ge.itemInformation(item.itemId)
          .then(async (info) => {
            item.information = info;
            data = item;
          });
      }).catch(() => data = null);
    return data;
  }

  async getGraph(itemId: Number) {
    const data = [];
    await rs.ge.graphData(itemId).then((item) => {
      const timestamp = Object.keys(item.daily);
      const values = Object.values(item.daily);
      const avg = Object.values(item.average);

      for (let i = values.length - 40; i < values.length; i++) {
        data.push({ timestamp: parseInt(timestamp[i]), price: values[i], avg: avg[i] });
      }
    });
    return data;
  }

  async getExtract(itemName: String): String {
    const body = await go.get(`https://runescape.wiki/api.php?action=query&format=json&prop=extracts%7Cpageimages%7Cinfo&iwurl=1&generator=search&formatversion=2&exsentences=2&exintro=1&explaintext=1&piprop=original&inprop=url&gsrsearch=${encodeURI(itemName)}&gsrlimit=1`,
      { responseType: 'json', resolveBodyOnly: true }).json();
    return body.query.pages[0];
  }

}
