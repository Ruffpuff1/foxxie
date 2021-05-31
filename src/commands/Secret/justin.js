const Discord = require('discord.js');
const { justinName } = require('../../../lib/util/constants');

module.exports = {
    name: 'justin',
    aliases: ['j', 'beaver'],
    category: 'secret',
    async execute({ message }) {
        
        message.delete();

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setThumbnail('https://cdn.discordapp.com/avatars/282321212766552065/97dff710cef05a13142c623778f4b974.webp?size=512')
            .setDescription(`**Here is the full name of <@282321212766552065>:**\n*${justinName}*`);

        const msg = await message.reply(embed);
        msg.delete({ timeout: 300000 })
    }
}