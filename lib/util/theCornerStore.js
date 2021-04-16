const { timezone, format, clockchannel, updateinterval } = require('../../lib/config');
const { getWelcomeChannel } = require('../settings')
const moment = require('moment')
const Discord = require('discord.js')
const tz = require('moment-timezone')
module.exports.mimuPick = (message) => {
    if (message.guild.id === '761512748898844702' && message.content.toLowerCase() === '.pick')
    return message.channel.send('**Darlin\'** I\'m flattered you want to pick me but again mimu\'s prefix is \`?\`.')
}

module.exports.memberCount = (client) => {
    const updateMembers = (guild) => {
        const channel = client.channels.cache.get('812226377717645332')
        if (channel == undefined) return
        channel.setName(`🥤 ┇𝐌𝐞𝐦𝐛𝐞𝐫𝐬・ ${guild.memberCount.toLocaleString()}`)
    }
    client.on('guildMemberAdd', (member) => { if (member.guild.id === '761512748898844702') updateMembers(member.guild) })
    client.on('guildMemberRemove', (member) => { if (member.guild.id === '761512748898844702') updateMembers(member.guild) })

    const guild = client.guilds.cache.get('761512748898844702')

    updateMembers(guild)
}

module.exports.clock = (client) => {
    const timeNow = moment().tz(timezone).format(format)
    const clockChannel = client.channels.cache.get(clockchannel)

    if (clockChannel === undefined) return

    clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNow}` }, 'Clock update')
    .catch(console.error)

    setInterval(() => {
        const timeNowUpdate = moment().tz(timezone).format(format)
        clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNowUpdate}` }, 'Clock update')
        .catch(console.error)

    }, updateinterval)
}

module.exports.welcomeMessage = async (member) => {

    const created = moment(member.user.createdTimestamp).format('llll');
    const joined = moment(member.joinedTimestamp).format('llll');

    const embed = new Discord.MessageEmbed()
        .setColor(member.guild.me.displayColor)
        .setTitle('**Welcome to The Corner Store!**')
        .setThumbnail(member.user.avatarURL())
        .setImage(`https://cdn.discordapp.com/attachments/798807457391968270/798810208310788136/tenor-2.gif`)
        .setFooter(`Joined: ${joined}\nCreated: ${created}`, member.guild.iconURL({dynamic: true}))
        .setTimestamp()
        .setDescription(`
   **•** Please read <#810039461306957876> to not be suprised by any punishments! If you'd like you could also select some <#800342663495680012> to let us get to know you.\n
   **•** First make an intro in <#795905444702322708> then start head to <#775306696658518027> or <#761518449172021268> to say hi.\n
   **•** Wanna invite a friend? Use the command \`.inv\` in the channel <#797433005425426433>.\n
   **•** If you have any questions feel free to reach out to staff or other server members. We hope you enjoy our shop!`);

   let welcomeChannel = await getWelcomeChannel(member.guild)
   if (!welcomeChannel) return;

   welChn = member.guild.channels.cache.get(welcomeChannel?.welcomeChannel)
   welChn.send(`<@${member.id}> **Just joined the server. <@&774173127717552139> be sure to welcome them. We now have ${member.guild.memberCount} member${member.guild.memberCount > 1 ? 's' : ''}!**`, {embed: embed} )
   .then(msg => {setTimeout(() => msg.delete(), 300000)})
}