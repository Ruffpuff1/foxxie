const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
const Discord = require('discord.js')
module.exports = {
    name: 'antiinvite',
    aliases: ['antiinv', 'ai', 'anti-invite'],
    usage: 'fox antiinvite [on|off]',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { lang, message, args, language } = props

        if (!args[0]) return;
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
        await mongo().then(async () => {
            if (args[0].toLowerCase() === 'on')
            try {
                const loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'));
                await serverSchema.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    antiInvite: true
                }, {
                    upsert: true
                })
                embed.setDescription("**Gotcha,** enabled automatic **invite** filtering. Now if someone sends an invite to a Discord server, I'll automatically delete it. (Ignores admins and server owners.)")
                loading.delete()
                return message.channel.send(embed)
            } finally {}

            if (args[0].toLowerCase() === 'off')
            try {
                const loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'));
                await serverSchema.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    $unset: {
                        antiInvite: ''
                    }
                })
                embed.setDescription("**Gotcha,** disabled automatic **invite** filtering. Now if someone sends an invite to a Discord server, I'll ignore it like normal.")
                loading.delete()
                return message.channel.send(embed)
            } finally {}

            if (args[0].toLowerCase() === 'none')
            try {
                const loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'))
                await serverSchema.findByIdAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    $unset: {
                        antiInvite: ''
                    }
                })
                embed.setDescription("**Gotcha,** reset automatic **invite** filtering to my default (off). Now if someone sends an invite to a Discord server, I'll ignore it like normal.")
                loading.delete()
                return message.channel.send(embed)
            } finally {}

            if (!args[0]) {
                const loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'));
                let anti_inv = await message.guild.settings.get(message.guild)
                if (anti_inv !== null) {
                    embed.setDescription(`Currently anti-invite filitering is set to **${anti_inv.antiInvite ? "on" : 'off'}**. If ya wanna change this, use the command \`fox antiinvite [on/off]\`.`)
                    loading.delete()
                    return message.channel.send(embed)
                }
                embed.setDescription(`Currently anti-invite filitering is set to **off**. If ya wanna change this, use the command \`fox antiinvite [on/off]\`.`)
                loading.delete()
                return message.channel.send(embed)
            } 
        })
    }
}