const Discord = require('discord.js')
const moment = require('moment')
const mongo = require('../../../lib/structures/database/mongo')
const welcomeMessageSchema = require('../../../lib/structures/database/schemas/server/welcome/welcomeMessageSchema')
const welcomeChannelSchema = require('../../../lib/structures/database/schemas/server/welcome/welcomeChannelSchema')
module.exports = {
    name: 'testjoin',
    aliases: ['testwelcome'],
    usage: 'fox testjoin (member)',
    category: 'settings',
    guildOnly: true,
    execute: async(lang, message, args, client) => {

        let guildId = message.guild.id
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        await mongo().then(async (mongoose) => {
            try {
                let welchn = await welcomeChannelSchema.findById({
                    _id: guildId
                })

                if (welchn === null) return;

                const welChannel = message.guild.channels.cache.get(welchn.welcomeChannel)
                    if (welChannel === undefined) return

                message.delete();     

        const created = moment(member.user.createdTimestamp).format('llll');
        const joined = moment(member.joinedTimestamp).format('llll');
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle('**Welcome to The Corner Store!**')
            .setThumbnail(member.user.avatarURL())
            .setFooter(`Joined: ${joined}\nCreated: ${created}`, member.guild.iconURL({dynamic: true}))
            .setTimestamp()
            .setImage(`https://cdn.discordapp.com/attachments/798807457391968270/798810208310788136/tenor-2.gif`)
            .setDescription(`
            **•** Please read <#810039461306957876> to not be suprised by any punishments! If you'd like you could also select some <#800342663495680012> to let us get to know you.
            
            **•** First make an intro in <#795905444702322708> then start head to <#775306696658518027> or <#761518449172021268> to say hi.
            
            **•** Wanna invite a friend? Use the command \`.link\` in the channel <#797433005425426433>.
            
            **•** If you have any questions feel free to reach out to staff or other server members. We hope you enjoy our shop!`)
        if (member.guild.id == '761512748898844702') {
        return welChannel.send(`<@${member.id}> **Just joined the server. <@&774173127717552139> be sure to welcome them.**`, {embed: welcomeEmbed,})
        .then(msg => {setTimeout(() => msg.delete(), 300000)})
        }

        let welmsg = await welcomeMessageSchema.findById({
            _id: guildId
        })
        let welcomemsg = `**<@${member.id}>** just joined the server!`
        if (welmsg !== null) welcomemsg = welmsg.welcomeMessage
        
        welChannel.send(welcomemsg)

            } finally {}
        })
    }
}