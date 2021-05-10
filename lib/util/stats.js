const Discord = require('discord.js')
const mongo = require('../../lib/structures/database/mongo')
const { botSettingsSchema } = require("../../lib/structures/database/BotSettingsSchema")
module.exports.stats = async (client) => {

    const guild = client.guilds.cache.get('825853736768372746'); if (!guild) return
    const channel = guild.channels.cache.find(c => c.id === '833092089587040256' && c.type === 'text'); 
    if (!channel) return console.log('Unable to find channel.');

    async function _emoji (status){
        if (status === 'online') return '<:StatusOnline:833108244397424681> **Online**'
        if (status === 'idle') return '<:StatusIdle:833108307174228049> **Idle**'
        if (status === 'dnd') return '<:StatusDnd:833108357845352518> **DND**'
        if (status === 'offline') return '<:StatusOffline:833108399536603167> **Offline**'
    }

    async function _uptime (){
        if (client.uptime > 86400000) return `${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`
        if (client.uptime > 3600000) return `${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`
        if (client.uptime > 60000) return `${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`
        return `${Math.floor(client.uptime / 1000) % 60}s`
    }

    async function _stats (embed){

        const arr = [`\`\`\`js`, `Total Guilds: ${client.guilds.cache.size}`, `Total Users: ${client.users.cache.size}`]
        arr.push(`Total Ram: ${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}mb`)
        arr.push(`Uptime: ${await _uptime()}`)
        arr.push(`\`\`\``)

        return embed
            .setDescription(arr.join('\n'))
    }

    if (client.user.id !== '812546582531801118') return;
    await mongo().then(async () => {
        try { this.state = await botSettingsSchema.findById(
            { _id: '812546582531801118' })
            return this.state
        } finally {}
    })

    let message = await channel.messages.fetch('833118737837195265')
    if (!message) return console.log('Unable to find message.');

    let embed = new Discord.MessageEmbed()
        .setTitle('Foxxie\'s Live stats')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(guild.me.displayColor)
        .setTimestamp()
        .addField(`${await _emoji(this.state.status.toLowerCase())}`, `\`\`\`js\nStatus: ${
            this.state.message ? this.state.message : 'Everything seems to be running smoothly'}\n\`\`\``)

    if (this.state.status.toLowerCase() !== 'offline') embed = await _stats(embed)
    message.edit(embed)
}