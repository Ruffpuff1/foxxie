const mongo = require('../../../lib/structures/database/mongo')
const Discord = require('discord.js')
const { serverSchema } = require('../../../lib/structures/database/ServerSchemas')
module.exports = {
    name: 'log',
    aliases: ['logging', 'logchannel', 'lc'],
    usage: `fox log [mod|edit|delete] (#channel|none|off)`,
    permissions: 'ADMINISTRATOR',
    //category: 'settings',
    execute: async(props) => {

        let { lang, message, args } = props

        validCase = ["mod", "edit", "delete"]

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)

        let use = args[0];
        let chn = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
        if (!use || !validCase.includes(use.toLowerCase())) return message.channel.send(`**Please,** specify a proper use case [mod|edit|delete].`)

        let settings = await message.guild.settings.get()

        let deleteCase = ['off', 'none']
    
        if (chn === undefined && !deleteCase.includes(args[1])) {
            if (!settings) return;
            if (use === validCase[0].toLowerCase() && !settings.modChannel) embed.setDescription(`Currently not logging **moderation**. You can set the moderation channel with \`fox log mod [#channel]\`.`)
            if (use === validCase[1].toLowerCase() && !settings.editChannel) embed.setDescription(`Currently not logging **edits**. You can set the edit channel with \`fox log edit [#channel]\`.`)
            if (use === validCase[2].toLowerCase() && !settings.deleteChannel) embed.setDescription(`Currently not logging **deletions**. You can set the delete channel with \`fox log delete [#channel]\`.`)

            if (use === validCase[0].toLowerCase() && settings.modChannel) embed.setDescription(`Currently logging **moderation** in <#${settings.modChannel}>.`)
            if (use === validCase[1].toLowerCase() && settings.editChannel) embed.setDescription(`Currently logging **edits** in <#${settings.editChannel}>.`)
            if (use === validCase[2].toLowerCase() && settings.deleteChannel) embed.setDescription(`Currently logging **deletions** in <#${settings.deleteChannel}>.`)

            return message.channel.send(embed)
        }

        deleteServerSetting = async (message, use) => {
            if (message.guild == undefined) return;
            await mongo().then(async () => {
                try {
                        await serverSchema.findByIdAndUpdate({
                            _id: message.guild.id
                        }, {
                            _id: message.guild.id,
                            $unset: {
                                [use]: ''
                            }
                        })
                        return message.responder.success();
                } finally {}
            })
        }

        let setting;
        if (use === validCase[0].toLowerCase()) setting = 'modChannel'
        if (use === validCase[1].toLowerCase()) setting = 'editChannel'
        if (use === validCase[2].toLowerCase()) setting = 'deleteChannel'

        if (!chn && deleteCase.includes(args[1])){
            return deleteServerSetting(message, setting)
        }

        await mongo().then(async () => {
            try {
            await serverSchema.findByIdAndUpdate({
                _id: message.guild.id
            }, {
                _id: message.guild.id,
                [setting]: chn
            }, {
                upsert: true
            })
            embed.setDescription(`Got it, set the **${setting}** setting to log in ${chn}.`)
            message.channel.send(embed)
            } finally {}
        })
    }
}