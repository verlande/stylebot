import { Command } from 'discord-akairo';

export default class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'h', 'commands'],
            args: [{
                id: 'command', type: 'commandAlias', match: 'content', default: null
            }],
            description: {
                usage: 'help <command>',
                examples: ['help', 'comands', 'h'],
                content: 'Display\'s the commands of the bot'
            },
            ratelimit: 1
        });
    }

    async exec(message, {command}) {
        const { prefix } = this.client.handlers.command;
        const primaryPrefix = Array.isArray(prefix) ? prefix[0] : prefix;

        //let inGuild = message.guild ? `This server's prefix is \`${Array.isArray(prefix) ? prefix.join(' or ') : primaryPrefix}\`` : '', `${primaryPrefix}help [command name]`;

        if (!command) {
            const embed = this.client.dialog('Help Menu', `
                ${message.guild ? `Prefix is \`${Array.isArray(prefix) ? prefix.join(' or ') : primaryPrefix}\`` : ''}
                ${primaryPrefix}help <command>
            `);
            this.handler.categories.forEach((cm, category) => {
                if (category !== 'admin') {
                    const dirSize = cm.filter(cmd => cmd.category === cm);
                    let mappedOut = cm.map(x => `\`${x}\``)
                      .join(', ');
                    embed.addField(`${dirSize.size} | **${category.toLowerCase()}**`, mappedOut.toLowerCase());
                }
            });
            return message.channel.send(embed);
        } else if (command) {
            const cmd = command;
            return message.channel.send(this.client.dialog(`Help - ${cmd.aliases[0]}`, `
                    **Name**: \`${cmd.aliases[0]}\`
                    **Aliases**: ${`${cmd.aliases.map(x => `\`${x}\``).join(', ') || 'No Alias'}`}
                    **Cooldown**: \`${cmd.cooldown / 1000 + 's' || 0}\`
                    **Description**: ${cmd.description.content || 'None'}
                    **Usage**: \`${cmd.description.usage || ''}\``).setFooter('Synxtax: [required] | <optional>'));
        }
    }
}


// import { Command } from 'discord-akairo';
// import { Message } from 'discord.js';
//
// export default class extends Command {
//   constructor() {
//     super('help', {
//       aliases: ['help', 'commands'],
//       channel: 'text',
//       description: {
//         content: 'Displays available commands or command information',
//         usage: '[command name]',
//         examples: ['', 'ping', 'play'],
//       },
//       flags: ['--pub', '--public'],
//       args: [
//         {
//           id: 'command',
//           type: 'commandAlias',
//         },
//         {
//           id: 'pub',
//           type: 'string',
//           match: 'flag',
//           flag: ['--pub', '--public'],
//         },
//       ],
//     });
//   }
//
//   async exec(message: Message, { command, pub }: { command: Command, pub: boolean }) {
//     const { prefix } = this.client.handlers.command;
//     const primaryPrefix = Array.isArray(prefix) ? prefix[0] : prefix;
//
//     if (!command) return this.defaultHelp(message, pub);
//
//     const { clientPermissions } = command;
//     const { userPermissions } = command;
//     const { examples } = command.description;
//
//     const embed = this.client.util.embed()
//       .setColor(0xFE9257)
//       .setTitle(`${primaryPrefix}${command} ${command.description.usage ? command.description.usage : ''}`)
//       .setDescription(command.description.content);
//
//     if (clientPermissions) embed.addField('Required Bot Permissions', clientPermissions.map((p) => `\`${toTitleCase(p)}\``).join(', '));
//     if (userPermissions) embed.addField('Required User Permissions:', userPermissions.map((p) => `\`${toTitleCase(p)}\``).join(', '));
//     if (command.aliases.length > 1) embed.addField('Aliases', command.aliases.slice(1).map((a) => `\`${a}\``).join(', '));
//     if (examples) embed.addField('Examples', examples.map((e) => `${primaryPrefix}${command.aliases[0]} ${e}`).join('\n'));
//
//     return message.util.send(embed);
//   }
//
//   async defaultHelp(message: Message, pub = false) {
//     const { prefix } = this.client.handlers.command;
//     const primaryPrefix = Array.isArray(prefix) ? prefix[0] : prefix;
//
//     const embed = this.client.util.embed()
//       .setColor(0xFE9257)
//       .setDescription([
//         message.guild ? `This server's prefix is \`${Array.isArray(prefix) ? prefix.join(' or ') : primaryPrefix}\`` : '',
//         `${primaryPrefix}help [command name]`,
//         !message.guild
//         // tslint:disable-next-line:prefer-template
//           ? '\nThere are commands that are only usable in servers.'
//                     + ' If you would like to see them, please trigger this command in a server.'
//           : '',
//       ]);
//
//     for (const [category, commands] of this.handler.categories) {
//       const title = {
//         admin: 'Administration',
//         help: 'Help',
//         general: 'General',
//         meetings: 'Meetings',
//       }[category];
//
//       if (
//         (!message.guild && category === 'admin') || (
//           message.guild && category === 'admin'
//                     && !(message.channel).permissionsFor(message.member).has('MANAGE_GUILD')
//         )
//       ) continue;
//
//       const publicCommands = message.author.id === this.client.ownerID && !pub
//         ? commands
//         : commands.filter((c) => !c.ownerOnly);
//       let parentCommands = publicCommands.filter((c) => Boolean(c.aliases && c.aliases.length));
//
//       if (!message.guild) parentCommands = parentCommands.filter((c) => c.channel !== 'guild');
//       if (title && parentCommands.size) embed.addField(title, parentCommands.map((c) => `\`${c.aliases[0]}\``).join(', '));
//     }
//
//     embed.fields = embed.fields.sort((a, b) => (a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)));
//
//     return message.util.send(embed);
//   }
// }
