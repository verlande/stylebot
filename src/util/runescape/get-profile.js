import go from 'got';

export const getProfile = async (username: string) =>
// return await hiscores.getPlayer(username).then(async data => {
//      return data;
//  }).catch(e => console.log(e));
  await go.get(`https://apps.runescape.com/runemetrics/profile?user=${encodeURI(username)}`).json();
