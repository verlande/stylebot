import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';


export default class PvmCommand extends Command {

  constructor() {
    super('pvm', {
      aliases: ['pvm'],
      channel: 'guild',
      description: { content: 'Displays PVM rotations' },
    });
  }

  async exec(message: Message): Promise<Message> {
    return message.channel.send(
      this.client.Dialog(null)
        .setTitle('PVM Rotations')
        .addField('Arraxi', [
          `**TOP PATH** ${this.arraxi()[0][0]}
                    **MID PATH** ${this.arraxi()[0][1]}
                    **BOTTOM PATH** ${this.arraxi()[0][2]}
                    ${this.arraxi()[1]} will close in ${this.arraxi()[2]} day${(this.arraxi()[2] > 1 ? 's' : '')}`,
        ], false)
        .addField('Vorago', [
          this.vorago(),
        ], false)
        .addField('ROTS', [
          `**WEST** ${this.rots()[0]}
                    **EAST** ${this.rots()[1]}
                    **Tomorrow's Rotation** ${this.rots()[2]}`,
        ], false),
    );
  }

  arraxi(): Array<String, Array<String>, String> {
    const ROTATIONS = [
      'Path 1 - Minions',
      'Path 2 - Acid',
      'Path 3 - Darkness',
    ];

    const currentRotation = Math.floor((((Math.floor(Math.floor(Date.now() / 1000) / (24 * 60 * 60))) + 3) % (4 * ROTATIONS.length)) / 4);
    const daysUntilNext = 4 - ((Math.floor((Date.now() / 1000) / (24 * 60 * 60))) + 3) % (4 * ROTATIONS.length) % 4;
    let nextRotation = currentRotation + 1;

    if (nextRotation === ROTATIONS.length) nextRotation = 0; // Resets it back to the beginning

    let topPath = 'OPEN';
    let midPath = 'OPEN';
    let botPath = 'OPEN';

    if (currentRotation === 0) { topPath = 'CLOSED'; }
    if (currentRotation === 1) { midPath = 'CLOSED'; }
    if (currentRotation === 2) { botPath = 'CLOSED'; }

    return [[topPath, midPath, botPath], ROTATIONS[nextRotation], daysUntilNext];
  }

  vorago(): String {
    const ROTATIONS = [
      'Ceiling Collapse',
      'Scopulus',
      'Vitalis',
      'Green Bomb',
      'Team Split',
      'The End',
    ];

    const currentRotation = Math.floor(((Math.floor(Math.floor(Date.now() / 1000) / (24 * 60 * 60))) - 6) % (7 * ROTATIONS.length) / 7);
    const daysNext = 7 - ((Math.floor(Date.now() / 1000 / (24 * 60 * 60))) - 6) % (7 * ROTATIONS.length) % 7;

    return `**Current Rotation** ${ROTATIONS[currentRotation]}\nNext Rotation is ${ROTATIONS[currentRotation + 1]} in ${daysNext} ${(daysNext) > 1 ? 'days' : 'a day'}`;// ${(daysNext) > 1 ? 'days' : 'a day'}`;
  }

  rots(): Array<any> {
    // const b = {
    //     A: 'Ahrim',
    //     D: 'Dharok',
    //     G: 'Guthan',
    //     K: 'Karil',
    //     T: 'Torag',
    //     V: 'Verac'
    // };
    //
    // const ROTATIONS = [
    //     [[b.D,b.T,b.V],[b.K,b.A,b.G]],
    //     [[b.K,b.T,b.G],[b.A,b.D,b.V]],
    //     [[b.K,b.G,b.V],[b.A,b.T,b.D]],
    //     [[b.G,b.T,b.V],[b.K,b.A,b.D]],
    //     [[b.K,b.T,b.V],[b.A,b.G,b.D]],
    //     [[b.A,b.G,b.D],[b.K,b.T,b.V]],
    //     [[b.K,b.A,b.D],[b.G,b.T,b.V]],
    //     [[b.A,b.T,b.D],[b.K,b.G,b.V]],
    //     [[b.A,b.D,b.V],[b.K,b.T,b.G]],
    //     [[b.K,b.A,b.G],[b.T,b.D,b.V]],
    //     [[b.A,b.T,b.G],[b.K,b.D,b.V]],
    //     [[b.A,b.G,b.V],[b.K,b.T,b.D]],
    //     [[b.K,b.A,b.T],[b.G,b.D,b.V]],
    //     [[b.K,b.A,b.V],[b.D,b.T,b.G]],
    //     [[b.A,b.T,b.V],[b.K,b.D,b.G]],
    //     [[b.K,b.D,b.G],[b.A,b.T,b.V]],
    //     [[b.D,b.T,b.G],[b.K,b.A,b.V]],
    //     [[b.G,b.D,b.V],[b.K,b.A,b.T]],
    //     [[b.K,b.T,b.D],[b.A,b.G,b.V]],
    //     [[b.K,b.D,b.V],[b.A,b.T,b.G]]
    // ];
    //
    // const seconds_in_day = 24 * 60 * 60;
    // let days_after_utc = Math.floor(Date.now() / seconds_in_day / 1000);
    //
    // let rotation = (days_after_utc % 20);
    // rotation = ROTATIONS[rotation];
    //
    // let west = '', east = '';
    //
    // rotation[0].forEach((e) => {
    //     west += '\n' + e;
    // });
    //
    // rotation[1].forEach((e) => {
    //     east += '\n' + e;
    // });

    const Nf = new Intl.NumberFormat('en-US');

    const NAMES = {
      A: 'Ahrim',
      D: 'Dharok',
      G: 'Guthan',
      K: 'Karil',
      T: 'Torag',
      V: 'Verac',
    };

    const ROTATIONS = [
      [[NAMES.D, NAMES.T, NAMES.V], [NAMES.K, NAMES.A, NAMES.G]],
      [[NAMES.K, NAMES.T, NAMES.G], [NAMES.A, NAMES.D, NAMES.V]],
      [[NAMES.K, NAMES.G, NAMES.V], [NAMES.A, NAMES.T, NAMES.D]],
      [[NAMES.G, NAMES.T, NAMES.V], [NAMES.K, NAMES.A, NAMES.D]],
      [[NAMES.K, NAMES.T, NAMES.V], [NAMES.A, NAMES.G, NAMES.D]],
      [[NAMES.A, NAMES.G, NAMES.D], [NAMES.K, NAMES.T, NAMES.V]],
      [[NAMES.K, NAMES.A, NAMES.D], [NAMES.G, NAMES.T, NAMES.V]],
      [[NAMES.A, NAMES.T, NAMES.D], [NAMES.K, NAMES.G, NAMES.V]],
      [[NAMES.A, NAMES.D, NAMES.V], [NAMES.K, NAMES.T, NAMES.G]],
      [[NAMES.K, NAMES.A, NAMES.G], [NAMES.T, NAMES.D, NAMES.V]],
      [[NAMES.A, NAMES.T, NAMES.G], [NAMES.K, NAMES.D, NAMES.V]],
      [[NAMES.A, NAMES.G, NAMES.V], [NAMES.K, NAMES.T, NAMES.D]],
      [[NAMES.K, NAMES.A, NAMES.T], [NAMES.G, NAMES.D, NAMES.V]],
      [[NAMES.K, NAMES.A, NAMES.V], [NAMES.D, NAMES.T, NAMES.G]],
      [[NAMES.A, NAMES.T, NAMES.V], [NAMES.K, NAMES.D, NAMES.G]],
      [[NAMES.K, NAMES.D, NAMES.G], [NAMES.A, NAMES.T, NAMES.V]],
      [[NAMES.D, NAMES.T, NAMES.G], [NAMES.K, NAMES.A, NAMES.V]],
      [[NAMES.G, NAMES.D, NAMES.V], [NAMES.K, NAMES.A, NAMES.T]],
      [[NAMES.K, NAMES.T, NAMES.D], [NAMES.A, NAMES.G, NAMES.V]],
      [[NAMES.K, NAMES.D, NAMES.V], [NAMES.A, NAMES.T, NAMES.G]],
    ];

    let currentRotation = (Math.floor((Date.now() / 1000) / (24 * 60 * 60)) % 20);

    if (currentRotation === -1 || currentRotation >= ROTATIONS.length) currentRotation = 0;

    const west = ROTATIONS[currentRotation][0];
    const east = ROTATIONS[currentRotation][1];
    const tomorrow = `\n**WEST:** ${ROTATIONS[currentRotation + 1][0]} **EAST:** ${ROTATIONS[currentRotation + 1][1]}`;

    return [west, east, tomorrow];
  }

}
