import { Inhibitor } from 'discord-akairo';

export default class BlacklistInhibitor extends Inhibitor {

  constructor() {
    super('blacklist', {
      reason: 'blacklist',
    });
  }

  exec(message: Message) {
    const blacklist = [];
    return blacklist.includes(message.author.id);
  }

}
