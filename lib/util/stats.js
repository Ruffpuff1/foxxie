const Discord = require('discord.js')
const mongo = require('../../lib/structures/database/mongo')
const { statusSchema } = require('../../lib/structures/database/schemas/statusSchema')
module.exports.stats = async (client) => {

    const guild = client.guilds.cache.get('825853736768372746');
    if (!guild) return
    
    const channel = guild.channels.cache.find(c => c.id === '833092089587040256' && c.type === 'text');
    if (!channel) return console.log('Unable to find channel.');


    await mongo().then(async () => {
        try {
            this.state = await statusSchema.findById({
                _id: client.user.id
            })
            return this.state
        } finally {}
    })


    if (client.user.id === '812546582531801118') {
    let message = await channel.messages.fetch('833118737837195265')
    if (!message) return console.log('Unable to find message.');

        const embed = new Discord.MessageEmbed()
            .setTitle('Foxxie\'s Live stats')
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(guild.me.displayColor)
            .setTimestamp()
            .addField(`${this.state.status.toLowerCase() === 'online'
                            ? '<:StatusOnline:833108244397424681>'
                            : `${this.state.status.toLowerCase() === 'idle'
                                ? '<:StatusIdle:833108307174228049>'
                                : `${this.state.status.toLowerCase() === 'dnd'
                                    ? '<:StatusDnd:833108357845352518>'
                                    : `${this.state.status.toLowerCase() === 'offline'
                                        ? '<:StatusOffline:833108399536603167>'
                                        : '<:StatusOffline:833108399536603167>'
                                    }`
                                }`
                        }`
        
        } **${this.state.status.toLowerCase() === 'online'
        ? 'Online'
        : `${this.state.status.toLowerCase() === 'idle'
            ? 'Idle'
            : `${this.state.status.toLowerCase() === 'dnd'
                ? 'DND'
                : `${this.state.status.toLowerCase() === 'offline'
                    ? 'Offline'
                    : 'Offline'
                }`
            }`
    }`

}**`, `\`\`\`javascript
Status: ${this.state.message ? this.state.message : 'Everything seems to be running smoothly'}
\`\`\``)
            .setDescription(`${this.state.status.toLowerCase() === 'offline'
? ''
: `\`\`\`javascript
Total Guilds: ${client.guilds.cache.size.toLocaleString()}
Total Users: ${client.users.cache.size.toLocaleString()}
Total Ram: ${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}mb
Uptime: ${client.uptime > 60000
    ?`${client.uptime > 3600000 
        ? `${client.uptime > 86400000
            ? `${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`
            : `${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`}`
        : `${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`
      }`
    :`${Math.floor(client.uptime / 1000) % 60}s`
                            }\`\`\``
}`)

        message.edit(embed)
    }
}