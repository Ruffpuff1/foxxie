const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { Command, Util } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: "urban",
            aliases: ['ud', 'slang', 'urban-dictionaray'],
            description: language => language.get('COMMAND_URBAN_DESCRIPTION'),
            usage: '[Term]',
            category: 'fun',
        })
    }

    async run(msg, [term]) {

        if (!term) return msg.responder.error('COMMAND_URBAN_NOWORD');
        const loading = await msg.responder.loading();
        const result = await axios.get(`http://api.urbandictionary.com/v0/define?term=$%7B${term}%7D`);

        if (!result || !result.data || !result.data.list || !result.data.list[3]) {
            msg.responder.error('COMMAND_URBAN_NODATA');
            return loading.delete();
        }

        let ex, str;
        result.data.list[3] ? ex = result.data.list[3]['example'] : ex = msg.language.get('COMMAND_URBAN_NODEFINITION');
        result.data.list[3] ? str = result.data.list[3]['definition'] : str = msg.language.get('COMMAND_URBAN_NOEXAMPLE');

        const embed = new MessageEmbed()
            .setTitle(Util.toTitleCase(term))
            .setURL(result.data.list[3].permalink)
            .setColor(msg.guild.me.displayColor)
            .setThumbnail(`https://i.imgur.com/qNTzb3k.png`)
            .setDescription(`${str.replace(/[\[\]']+/g,'')}\n\n\`👍\` ${result.data.list[3]['thumbs_up']}\n\`👎\` ${result.data.list[3]['thumbs_down']}`)
            .setFooter(msg.language.get('COMMAND_URBAN_FOOTER', result.data.list[3].author))
            .addField(msg.language.get('COMMAND_URBAN_EXAMPLE'), ex.replace(/[\[\]']+/g,''))
            
        msg.channel.send(embed);
        return loading.delete()
    }
}