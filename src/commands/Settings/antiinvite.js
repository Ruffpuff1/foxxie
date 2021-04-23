const mongo = require('../../../lib/structures/database/mongo')
const { serverSettings } = require('../../../lib/settings')
const { serverSchema } = require('../../../lib/structures/schemas')
const Discord = require('discord.js')
module.exports = {
    name: 'antiinvite',
    aliases: ['antiinv', 'ai', 'anti-invite'],
    usage: 'fox antiinvite [on|off]',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
        await mongo().then(async () => {
            if (args[0]?.toLowerCase() === 'on')
            try {
                const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);
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

            if (args[0]?.toLowerCase() === 'off')
            try {
                const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);
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

            if (args[0]?.toLowerCase() === 'none')
            try {
                const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING)
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
                const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);
                let anti_inv = await serverSettings(message)
                if (anti_inv !== null) {
                    embed.setDescription(`Currently anti-invite filitering is set to **${anti_inv?.antiInvite ? "on" : 'off'}**. If ya wanna change this, use the command \`fox antiinvite [on/off]\`.`)
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