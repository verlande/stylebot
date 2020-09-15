import { MessageEmbed } from 'discord.js'
import Constants from 'constants'
import finder from 'find-package-json'

const { repository } = finder(__dirname).next().value;

module.exports = {
    confirmReply: function(title, text) {
        return new MessageEmbed().setTitle(title)
            .setColor(Constants.Colors.DEFAULT)
            .setDescription(text)
    },

    errorReply: function(command, text) {
        return new MessageEmbed().setTitle(`Error executing ${command.aliases[0]}`)
            .setColor(Constants.Colors.RED)
            .setDescription(text)
            .setFooter(`Issue? - ${repository}/issues`)
    }
};