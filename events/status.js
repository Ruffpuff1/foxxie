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
        .setTitle(`${bot.user.username} v${botver}`)
        .setColor(guild.me.displayColor)
        .setTimestamp()
        .addField('**Stats**:', `**${bot.users.cache.size.toLocaleString()}** users and **${bot.guilds.cache.size.toLocaleString()}** guilds.`, false)
        .addField('**Memory**:', `**${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024).toLocaleString()}** megabytes.`)
        .addField('**Uptime**:', `**${Math.floor(bot.uptime / 1000).toLocaleString()}** seconds.`, false)
        .addField('**Message**:', `\`Everything seems to be fine.\``, false)


    message.edit(`Hi this is my current status.`, {embed:embed})
}