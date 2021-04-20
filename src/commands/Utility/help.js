const Discord = require('discord.js');
const { devs } = require('../../../lib/config');
module.exports = {
    name: 'help',
    aliases: ['commands', 'h'],
    category: 'utility',
    usage: 'help (command)',
    execute(lang, message, args, client) {

        const { commands } = message.client;
        let cmdArr = commands.array();
        let funCmds = [];
        let modCmds = [];
        let setCmds = [];
        let utilCmds = [];
        let secCmds = [];
        let devCmds = [];

        for (let c of cmdArr) {
            let fun = c.category === "fun"
            let mod = c.category === "moderation"
            let set = c.category === "settings"
            let util = c.category === "utility"
            let dev = c.category === "developer"
            let sec = c.category === "secret"

            if (fun) funCmds.push(c.name)
            if (mod) modCmds.push(c.name)
            if (dev) devCmds.push(c.name)
            if (set) setCmds.push(c.name)
            if (util) utilCmds.push(c.name)
            if (sec) secCmds.push(c.name)
        };

        const helpEmbed = new Discord.MessageEmbed()

        let sendIn = /\-c\s*/
        let devMenu = /\-d\s*/

        if (devs.includes(message.author.id) && devMenu.test(message.content))
            helpEmbed
                .addField("**Developer**" + ` **(${devCmds.length})**`, devCmds.map(a => `\`${a}\``).join(", "))
                .addField("**Secret**" + ` **(${secCmds.length})**`, secCmds.map(a => `\`${a}\``).join(", "))

        helpEmbed
            .setTitle(lang.COMMAND_HELP_TITLE)
            .setDescription(lang.COMMAND_HELP_DESCRIPTION)
            .setColor(message.guild.me.displayColor)
            .setThumbnail(client.user.displayAvatarURL( { dynamic: true } ))
            .addField(lang.COMMAND_HELP_FUN + ` **(${funCmds.length})**`, funCmds.map(a => `\`${a}\``).join(", "))
            .addField(lang.COMMAND_HELP_MODERATION + ` **(${modCmds.length})**`, modCmds.map(a => `\`${a}\``).join(", "))
            .addField(lang.COMMAND_HELP_SETTINGS + ` **(${setCmds.length})**`, setCmds.map(a => `\`${a}\``).join(", "))
            .addField(lang.COMMAND_HELP_UTILITY + ` **(${utilCmds.length})**`, utilCmds.map(a => `\`${a}\``).join(", "))
            .addField(lang.COMMAND_ABOUT_LINKS, lang.COMMAND_ABOUT_LINKS_LINKS)

        let descriptions = lang.COMMAND_DESCRIPTIONS

        if (!args.length || args[0]?.toLowerCase() === '-d') {
            message.react('✅')
            return message.author.send(helpEmbed)
            .then(() => {
                if (message.channel.type === 'dm') return;
            })
            .catch(error => {console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            
            return message.channel.send(helpEmbed)})
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command && sendIn.test(message.content)) return message.channel.send(helpEmbed)

        if (command) {
        
            let commandUp = command.name.toUpperCase()

            const helpCommandEmbed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setTitle(command.name)
                .setDescription(`${descriptions[commandUp]}\n
${command.permissions?`**Permissions Required:** \`${command.permissions}\``:''}`)
                .addField(`**${lang.COMMAND_HELP_USAGE} ${lang.COMMAND_HELP_TRUE})**`, `\`${command.usage}\``);

            if (command.aliases) helpCommandEmbed.setTitle(`${command.name} (${command.aliases.join(', ')})`)
            if (message.content.includes('-c')) return message.channel.send(helpCommandEmbed)

            message.react('✅')
            return message.author.send(helpCommandEmbed)
            .catch(error => {console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            return message.channel.send(helpCommandEmbed)})
        }
        if (!command) {
            return message.reply(lang.COMMAND_HELP_NOTVALID).then(msg => {setTimeout(() => msg.delete(), 10000)}).catch()
        } 
    }
}