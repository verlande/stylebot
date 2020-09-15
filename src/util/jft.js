import { MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';
import Constants from 'constants';
import jft from 'static/jft/content.json';

export const getForDate = (date: DateTime = DateTime.local()) => jft[date.toFormat('M-d')];

export function getDialog(dialog, jft = {}) {
  return dialog
    .setTitle(`${jft.vision}`)
    .setAuthor(`${jft.date}`)
    .setDescription([
      `_${jft.quote}_`,
      `${jft.reference}`,
      '',
      '-------------',
    ].concat(jft.article.reduce((r, a) => r.concat(a, ''), [''])))
    .addFields(
      { name: 'Just For Today', value: jft.jft },
    );
}
