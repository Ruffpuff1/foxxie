const Discord = require('discord.js');
const { owner } = require('../../../config/foxxie');
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'help',
    aliases: ['commands', 'h'],
    category: 'utility',
    usage: 'help (command) (-c|-channel)',
    execute(lang, message, args, client) {

        const channelFlag = /\-channel\s*|-c\s*/gi
        const orginalFlag = /\-orginal\s*|-o\s*/gi

        const categories = ['automation', 'fun', 'moderation', 'roleplay', 'settings', 'utility']
        const { commands } = message.client;
        let cmdArr = commands.array();
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            //.setThumbnail(message.client.user.displayAvatarURL({dynamic: true}))
        
        let categoryDescriptions = lang.CATEGORY_DESCRIPTIONS
        let helpDescription = lang.COMMAND_HELP_DESCRIPTION_BIG

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

        argToCap = (cmd) => {
            return cmd.charAt(0).toUpperCase() + cmd.slice(1)
        }

        bigMenu = () => {

            embed
                .setTitle(`Foxxie's commands!`)
                .setDescription(`These are all of my commands. For a list of commands in a certain category do \`fox help (category)\`.\n\n${helpDescription}`)
                .addField(`:robot: **Automation (${autoCmds.length})**`, categoryDescriptions['AUTOMATION'], true)
                .addField(`:laughing: **Fun (${funCmds.length})**`, categoryDescriptions['FUN'], true)
                .addField(`:shield: **Moderation (${modCmds.length})**`, categoryDescriptions['MODERATION'], true)
                .addField(`:hugging: **Roleplay (${rpCmds.length})**`, categoryDescriptions['ROLEPLAY'], true)
                .addField(`:wrench: **Settings (${setCmds.length})**`, categoryDescriptions['SETTINGS'], true)
                .addField(`:flashlight: **Utility (${utilCmds.length})**`, categoryDescriptions['UTILITY'], true)
                .addField(lang.COMMAND_ABOUT_LINKS, lang.COMMAND_ABOUT_LINKS_LINKS)

            if (channelFlag.test(message.content)) return message.channel.send(embed)
            message.react(approved)
            return message.author.send(embed)
            .catch(error => message.channel.send(embed))
        }

        originalMenu = () => {
            embed
                .setTitle(lang.COMMAND_HELP_TITLE)
                .setDescription(lang.COMMAND_HELP_DESCRIPTION)
                .addField('**Automation**' + ` **(${autoCmds.length})**`, autoCmds.map(a => `\`${a}\``).join(", "))
                .addField(lang.COMMAND_HELP_FUN + ` **(${funCmds.length})**`, funCmds.map(a => `\`${a}\``).join(", "))
                .addField(lang.COMMAND_HELP_MODERATION + ` **(${modCmds.length})**`, modCmds.map(a => `\`${a}\``).join(", "))
                .addField(lang.COMMAND_HELP_ROLEPLAY + ` **(${rpCmds.length})**`, rpCmds.map(a => `\`${a}\``).join(", "))
                .addField(lang.COMMAND_HELP_SETTINGS + ` **(${setCmds.length})**`, setCmds.map(a => `\`${a}\``).join(", "))
                .addField(lang.COMMAND_HELP_UTILITY + ` **(${utilCmds.length})**`, utilCmds.map(a => `\`${a}\``).join(", "))
                .addField(lang.COMMAND_ABOUT_LINKS, lang.COMMAND_ABOUT_LINKS_LINKS)

            if (channelFlag.test(message.content)) return message.channel.send(embed)
            message.react(approved)
            return message.author.send(embed)
            .catch(error => message.channel.send(embed))
        }

        commandCategories = () => {
            let cateCmds = [];
            for (let c of cmdArr){
                let cate = c.category === args[0].toLowerCase()
                if (cate) cateCmds.push(c.name)
            }
            
            embed
                .setTitle(`Foxxie's ${argToCap(args[0].toLowerCase())} commands!`)
                .setDescription(`These are all of my **${args[0].toLowerCase()}** commands.\n${categoryDescriptions[args[0].toUpperCase()]}
\nAdditionally for each command you can use \`fox help (command)\` for a detailed description on that command as well as example usage.`)
                .addField(`**${argToCap(args[0].toLowerCase())}**` + ` **(${cateCmds.length})**`, cateCmds.map(a => `\`${a}\``).join(", "))
                .addField(lang.COMMAND_ABOUT_LINKS, lang.COMMAND_ABOUT_LINKS_LINKS)

            if (channelFlag.test(message.content)) return message.channel.send(embed)

            message.react(approved)
            return message.author.send(embed)
            .catch(error => message.channel.send(embed))
        }

        commandMenu = () => {

            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) return message.channel.send(lang.COMMAND_HELP_NOTVALID)

            if (command) {
        
                let commandUp = command.name.toUpperCase()
                let descriptions = lang.COMMAND_DESCRIPTIONS

                embed
                    .setTitle(command.name)
                    .setDescription(`${descriptions[commandUp]}\n
${command.permissions?`**Permissions Required:** \`${command.permissions}\``:''}`)
                    .addField(`**${lang.COMMAND_HELP_USAGE} ${lang.COMMAND_HELP_TRUE})**`, `\`${command.usage}\``);

                if (command.aliases) embed.setTitle(`${command.name} (${command.aliases.join(', ')})`)
                if (channelFlag.test(message.content)) return message.channel.send(embed)

                message.react(approved)
                return message.author.send(embed)
                .catch(error => message.channel.send(embed))
            }
        }

        //if (!args.length || channelFlag.test(args[0]) && orginalFlag.test(message.content || args[0])) return originalMenu()
        if (!args.length || channelFlag.test(args[0])) return bigMenu()
        if (categories.includes(args[0].toLowerCase())) return commandCategories()
        commandMenu()

    }
}