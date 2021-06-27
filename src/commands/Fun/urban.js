const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');
const { Command, util, MENTION_REGEX: { emoji } } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: "urban",
            aliases: ['ud', 'slang', 'urban-dictionaray'],
            description: language => language.get('COMMAND_URBAN_DESCRIPTION'),
            requiredPermissions: ['EMBED_LINKS'],
            usage: '[Term] [Number]',
            nsfw: true,
            category: 'fun',
        })

        this.baseURL = 'http://api.urbandictionary.com/v0';
    }

    splitText(str, length) {
        const dx = str.substring(0, length).lastIndexOf(' ');
        const pos = dx === -1 ? length : dx;
        return str.substring(0, pos);
    }

    async run(msg, args) {

        let resultNum = args.find(arg => /\d+/.test(arg));
        if (resultNum) args.splice(args.indexOf(resultNum), 1);
        else resultNum = 0;
        
        const term = await this.cleanEmotes(args.join(' '));

        if (!term) return msg.responder.error('COMMAND_URBAN_NOWORD');
        const loading = await msg.responder.loading();

        const body = await req(this.baseURL)
            .path('define')
            .query('term', term)
            .json();

        if (resultNum > 1) resultNum--;

        const result = body.list[resultNum];
        if (!result) {
            msg.responder.error('COMMAND_URBAN_MAX', body.list.length);
            return loading.delete();
        }
        const wdef = result.definition.length > 1000
            ? `${this.splitText(result.definition, 1000)}...`
            : result.definition;

        const wex = result.example.length > 1000
			? `${this.splitText(result.example, 1000)}...`
			: result.example;

        const name = util.toTitleCase(result.word);
        
        const embed = new MessageEmbed()
            .setTitle(name)
            .setURL(result.permalink)
            .setColor(msg.guild.me.displayColor)
            .setThumbnail(`https://i.imgur.com/qNTzb3k.png`)
            .setDescription(`${this.removeBrackets(wdef)}\n\n\`👍\` ${result.thumbs_up}\n\`👎\` ${result.thumbs_down}`)
            .setFooter(msg.language.get('COMMAND_URBAN_FOOTER', result.author))
            .addField(msg.language.get('COMMAND_URBAN_EXAMPLE'), `*${this.removeBrackets(wex)}*`)
            
        msg.channel.send(embed);
        return loading.delete()
    }

    removeBrackets(text) {
        return text.replace(/\[([^\[\]]+)\]/g, '$1');
    }

    cleanEmotes(term) {
        return term
            .replace(/:[^:\s]*(?:::[^:\s]\*)*:/gm, '')
            .replace(emoji, '')
            .replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi, '');
    }
}