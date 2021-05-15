const Discord = require('discord.js');
const { toUpperCaseFirst } = require('../../../lib/util/util');
module.exports = {
    name: 'help',
    aliases: ['commands', 'h'],
    category: 'utility',
    usage: 'help (command|category) (-c|-channel)',
    execute(props) {

        let { lang, message, args, language } = props;

        const channelFlag = /\-channel\s*|-c\s*/gi

        const categories = ['automation', 'fun', 'moderation', 'roleplay', 'settings', 'utility']
        const { commands } = message.client;
        let cmdArr = commands.array();
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
        
        let autoCmds = [];
            let funCmds = [];
            let modCmds = [];
            let rpCmds = [];
            let setCmds = [];
            let utilCmds = [];
            let secCmds = [];
            let devCmds = [];

            for (let c of cmdArr) {
                let auto = c.category === 'automation'
                let fun = c.category === "fun"
                let mod = c.category === "moderation"
                let rp = c.category === "roleplay"
                let set = c.category === "settings"
                let util = c.category === "utility"
                let dev = c.category === "developer"
                let sec = c.category === "secret"

                if (auto) autoCmds.push(c.name)
                if (fun) funCmds.push(c.name)
                if (mod) modCmds.push(c.name)
                if (dev) devCmds.push(c.name)
                if (rp) rpCmds.push(c.name)
                if (set) setCmds.push(c.name)
                if (util) utilCmds.push(c.name)
                if (sec) secCmds.push(c.name)
            };

        bigMenu = () => {

            embed
                .setTitle(language.get('COMMAND_HELP_EMBED_TITLE', lang, language, lang))
                .setDescription(language.get('COMMAND_HELP_EMBED_DESCRIPTION', lang, language, lang))
                .addField(language.get('COMMAND_HELP_EMBED_AUTOMATION', lang, autoCmds.length), language.get('COMMAND_HELP_CATEGORY_AUTOMATION', lang), true)
                .addField(language.get('COMMAND_HELP_EMBED_FUN', lang, funCmds.length), language.get('COMMAND_HELP_CATEGORY_FUN', lang), true)
                .addField(language.get('COMMAND_HELP_EMBED_MODERATION', lang, modCmds.length), language.get('COMMAND_HELP_CATEGORY_MODERATION', lang), true)
                .addField(language.get('COMMAND_HELP_EMBED_ROLEPLAY', lang, rpCmds.length), language.get('COMMAND_HELP_CATEGORY_ROLEPLAY', lang), true)
                .addField(language.get('COMMAND_HELP_EMBED_SETTINGS', lang, setCmds.length), language.get('COMMAND_HELP_CATEGORY_SETTINGS', lang), true)
                .addField(language.get('COMMAND_HELP_EMBED_UTILITY', lang, utilCmds.length), language.get('COMMAND_HELP_CATEGORY_UTILITY', lang), true)
                .addField(language.get('COMMAND_HELP_LINKS_TITLE', lang), language.get('COMMAND_HELP_LINKS_DESCRIPTION', lang))

            if (channelFlag.test(message.content)) return message.channel.send(embed)
            message.responder.success();
            return message.author.send(embed)
            .catch(e => message.channel.send(embed))
        }

        commandCategories = () => {
            let cateCmds = [];
            for (let c of cmdArr){
                let cate = c.category === args[0].toLowerCase()
                if (cate) cateCmds.push(c.name)
            }
            
            embed
                .setTitle(language.get('COMMAND_HELP_CATEGORY_EMBED_TITLE', lang, args[0]))
                .setDescription(language.get('COMMAND_HELP_CATEGORY_EMBED_DESCRIPTION', lang, args[0], language, lang))
                .addField(`**${args[0].toUpperCaseFirst()}**` + ` **(${cateCmds.length})**`, cateCmds.map(a => `\`${a}\``).join(", "))
                .addField(language.get('COMMAND_HELP_LINKS_TITLE', lang), language.get('COMMAND_HELP_LINKS_DESCRIPTION', lang))

            if (channelFlag.test(message.content)) return message.channel.send(embed)

            message.responder.success();
            return message.author.send(embed)
            .catch(e => message.channel.send(embed))
        }

        commandMenu = () => {

            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) return language.send('COMMAND_HELP_COMMAND_NOTVALID', lang)//message.channel.send(lang.COMMAND_HELP_NOTVALID)

            if (command) {
        
                let commandUp = command.name.toUpperCase()

                embed
                    .setTitle(command.name)
                    .setDescription(`${language.get(`COMMAND_${commandUp}_DESCRIPTION`, 'en-US')}\n
${command.permissions? language.get('COMMAND_HELP_PERMISSIONS', lang, command.permissions) :''}`)
                    .addField(language.get('COMMAND_HELP_USAGE', lang), `\`${command.usage}\``);

                if (command.aliases) embed.setTitle(`${command.name} (${command.aliases.join(', ')})`)
                if (channelFlag.test(message.content)) return message.channel.send(embed)

                message.responder.success();
                return message.author.send(embed)
                .catch(error => message.channel.send(embed))
            }
        }

        if (!args.length || channelFlag.test(args[0])) return bigMenu()
        if (categories.includes(args[0].toLowerCase())) return commandCategories()
        commandMenu()

    }
}