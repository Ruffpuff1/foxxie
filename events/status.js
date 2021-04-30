const { MessageEmbed } = require("discord.js");
const { botver } = require('../config.json')
module.exports.status = async (bot) => {

    if (bot.user.id !== '827514096865509386') return;

    const guild = bot.guilds.cache.get('835603339667832914');
    if (!guild) return
    
    const channel = guild.channels.cache.find(c => c.id === '835610374849429524' && c.type === 'text');
    if (!channel) return;

    let message = await channel.messages.fetch('837509557701181450')
    .catch((err) => console.error(err))

    if (!message) return;

    const embed = new MessageEmbed()
        .setColor(guild.me.displayColor)
        .setTimestamp()
        .addField('Version:', `\`v${botver}\``, false)
        .addField('Users:', `\`${bot.users.cache.size}\``, false)
        .addField('Guilds:', `\`${bot.guilds.cache.size}\``, false)
        .addField('Status:', `\`Everything seems to be fine.\``, false)


    message.edit(`Hi this is my current status.`, {embed:embed})
}