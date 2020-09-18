import go from 'got';

export const voiceOfSeren = async (): String => {
  let str = '';
  await go.get('https://chisel.weirdgloop.org/api/runescape/vos', {
    responseType: 'json'
  }).then(response => {
    const districts = response.body.districts;
    str = `Currently active in ${districts[0]} & ${districts[1]}`;
  }).catch(err => console.log(err));
  return str;
};

export const cache = (): String => {
  const d = new Date();

  let hoursUntilBoost = 2 - d.getUTCHours() % 3;
  let minutesUntilBoost = 60 - d.getUTCMinutes();

  const secondsUntil = 3600 - (d.getUTCMinutes()) % 60 * 60 - d.getUTCSeconds();
  const minutesUntil = Math.floor(secondsUntil / 60);

  let boostTimeStr = '';
  let cacheTimeStr = '';

  if (minutesUntilBoost === 60) {
    hoursUntilBoost++;
    minutesUntilBoost = 0;
  }

  if (hoursUntilBoost > 0) {
    boostTimeStr += `${hoursUntilBoost} hour${hoursUntilBoost > 1 ? 's' : ''}`;
  }

  if (hoursUntilBoost >= 1 && minutesUntilBoost > 1) {
    boostTimeStr += ` and ${minutesUntilBoost} minute${minutesUntilBoost > 1 ? 's' : ''}`;
  }

  if (minutesUntilBoost > 1 && hoursUntilBoost < 1) {
    boostTimeStr += `${minutesUntilBoost} minute${minutesUntilBoost > 0 && minutesUntilBoost < 2 ? '' : 's'}`;
  }

  if (minutesUntil === 0) {
    cacheTimeStr += '1 hour';
  }

  if (minutesUntil > 0) {
    cacheTimeStr += `${minutesUntil} minute${minutesUntil > 0 && minutesUntil < 1 ? '' : 's'}`;
  }

  if (hoursUntilBoost === 2 && minutesUntilBoost > 50) {
    boostTimeStr = 'NOW!';
  }
  return `Next cache will be in **${cacheTimeStr}**\nBoost will be in **${boostTimeStr}**`;

};

export const sinkhole = (): String => {
  const secondsUntil = 3600 - (new Date().getMinutes() + 30) % 60 * 60 - new Date().getUTCSeconds();
  const minutesUntil = Math.floor(secondsUntil / 60);
  let timeStr = '';

  if (minutesUntil === 0) {
    timeStr += 'Right now!'
  }

  if (minutesUntil > 0) {
    timeStr += `Next sinkhole in ${minutesUntil} minute${minutesUntil > 0 && minutesUntil < 1 ? '' : 's'}`
  }
  return timeStr;
};

export const spotlight = (): String => {
  const MINIGAMES = [
    'Pest Control',
    'Soul Wars',
    'Fist of Guthix',
    'Barbarian Assault',
    'Conquest',
    'Fishing Trawler',
    'The Great Orb Project',
    'Flash Powder Factory',
    'Castle Wars',
    'Stealing Creation',
    'Cabbage Facepunch Bonanza',
    'Heist',
    'Mobilising Armies',
    'Barbarian Assault',
    'Conquest',
    'Fist of Guthix',
    'Castle Wars',
    'Pest Control',
    'Soul Wars',
    'Fishing Trawler',
    'The Great Orb Project',
    'Flash Powder Factory',
    'Stealing Creation',
    'Cabbage Facepunch Bonanza',
    'Heist',
    'Trouble Brewing',
    'Castle Wars'
  ];

  let currentSpotlight = Math.floor((((Math.floor((Date.now() / 1000) / (24 * 60 * 60))) - 49) % (3 * MINIGAMES.length)) / 3);
  let daysUntilNext = 3 - ((Math.floor((Date.now() / 1000) / (24 * 60 * 60))) - 49) % (3 * MINIGAMES.length) % 3;
  let nextSpotlight = currentSpotlight + 1;

  if (nextSpotlight === MINIGAMES.length) nextSpotlight = 0;

  let toSend = [];

  toSend.push(`The current minigame that is on spotlight is **${MINIGAMES[currentSpotlight]}**.`);
  toSend.push(`The next minigame to be on spotlight will be **${MINIGAMES[nextSpotlight]}** in **${daysUntilNext}** day${(daysUntilNext > 1 ? `s` : ``)}.`);

  toSend = toSend.join('\n');
  return toSend;
};


export const warbands = (): Array<Number, Number> => {
  let d = new Date(), diff = new Date(), seconds;
  let day = d.getUTCDate() - d.getUTCDay();

  if (d.getUTCDate() === 0 && d.getUTCHours() < 12) {
    day = day - 7;
  }

  diff.setUTCDate(day);
  diff.setUTCHours(12, 0, 0, 0);
  seconds = d.valueOf() - diff.valueOf();

  if (seconds !== Math.abs(seconds)) {
    return;
  }

  seconds = Math.floor(seconds / 1000);
  seconds = 25200 - (seconds % 25200);

  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  seconds = (seconds % 3600) % 60;

  return [hours, minutes];
};
