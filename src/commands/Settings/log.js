const mongo = require('../../../lib/structures/database/mongo')
const Discord = require('discord.js')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
const { serverSettings, deleteServerSetting } = require('../../../lib/settings')
module.exports = {
    name: 'log',
    aliases: ['logging', 'logchannel', 'lc'],
    usage: `fox log [mod|edit|delete] (#channel|none|off)`,
    permissions: 'ADMINISTRATOR',
    category: 'settings',
    execute: async (lang, msg, args) => {

        validCase = ["mod", "edit", "delete"]

        const embed = new Discord.MessageEmbed()
            .setColor(msg.guild.me.displayColor)

        let use = args[0];
        let chn = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[1])
        if (!use || !validCase.includes(use.toLowerCase())) return msg.channel.send(`**Please,** specify a proper use case [mod|edit|delete].`)

        let settings = await serverSettings(msg)

        let deleteCase = ['off', 'none']
    
        if (chn === undefined && !deleteCase.includes(args[1])) {
            if (!settings) return;
            if (use === validCase[0].toLowerCase() && !settings.modChannel) embed.setDescription(`Currently not logging **moderation**. You can set the moderation channel with \`fox log mod [#channel]\`.`)
            if (use === validCase[1].toLowerCase() && !settings.editChannel) embed.setDescription(`Currently not logging **edits**. You can set the edit channel with \`fox log edit [#channel]\`.`)
            if (use === validCase[2].toLowerCase() && !settings.deleteChannel) embed.setDescription(`Currently not logging **deletions**. You can set the delete channel with \`fox log delete [#channel]\`.`)

            if (use === validCase[0].toLowerCase() && settings.modChannel) embed.setDescription(`Currently logging **moderation** in <#${settings.modChannel}>.`)
            if (use === validCase[1].toLowerCase() && settings.editChannel) embed.setDescription(`Currently logging **edits** in <#${settings.editChannel}>.`)
            if (use === validCase[2].toLowerCase() && settings.deleteChannel) embed.setDescription(`Currently logging **deletions** in <#${settings.deleteChannel}>.`)

            return msg.channel.send(embed)
        }

        let setting;
        if (use === validCase[0].toLowerCase()) setting = 'modChannel'
        if (use === validCase[1].toLowerCase()) setting = 'editChannel'
        if (use === validCase[2].toLowerCase()) setting = 'deleteChannel'

        if (!chn && deleteCase.includes(args[1])){
            return deleteServerSetting(msg, setting)
        }

        await mongo().then(async () => {
            try {
            await serverSchema.findByIdAndUpdate({
                _id: msg.guild.id
            }, {
                _id: msg.guild.id,
                [setting]: chn
            }, {
                upsert: true
            })
            embed.setDescription(`Got it, set the **${setting}** setting to log in ${chn}.`)
            msg.channel.send(embed)
            } finally {}
        })
    }
}