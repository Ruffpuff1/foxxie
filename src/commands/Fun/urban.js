const Discord = require('discord.js');
const axios = require('axios');
const { toUpperCaseFirst } = require('../../../lib/util/util')

module.exports = {
    name: "urban",
    aliases: ['ud', 'slang'],
    usage: 'fox urban [term]',
    category: 'fun',
    async execute (props) {

        let { message, args, lang, language } = props

        if (!args[0]) return language.send('COMMAND_URBAN_NOWORD', lang);
        let loading = await language.send("MESSAGE_LOADING", lang);
        const result = await axios.get(`http://api.urbandictionary.com/v0/define?term=$%7B${args[0]}%7D`);
        
        if (!result || !result.data || !result.data.list || !result.data.list[3]) {
            language.send('COMMAND_URBAN_NODATA', lang);
            return loading.delete()
        }

        let ex;
        let str;
        result.data.list[3] ? ex = result.data.list[3]['example'] : ex = language.get('COMMAND_URBAN_NODEFINITION', lang);
        result.data.list[3] ? str = result.data.list[3]['definition'] : str = language.get('COMMAND_URBAN_NOEXAMPLE', lang);

        const embed = new Discord.MessageEmbed()
            .setTitle(args[0].toUpperCaseFirst())
            .setURL(result.data.list[3].permalink)
            .setColor(message.guild.me.displayColor)
            .setThumbnail(`https://i.imgur.com/qNTzb3k.png`)
            .setDescription(`${str.replace(/[\[\]']+/g,'')}\n\n\`👍\` ${result.data.list[3]['thumbs_up']}\n\`👎\` ${result.data.list[3]['thumbs_down']}`)
            .setFooter(language.get('COMMAND_URBAN_FOOTER', lang, result.data.list[3].author))
            .addField(language.get('COMMAND_URBAN_EXAMPLE', lang), ex.replace(/[\[\]']+/g,''))

        message.channel.send(embed);
        loading.delete();
    }
}