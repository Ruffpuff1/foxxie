const Discord = require('discord.js');
module.exports = {
    name: 'help',
    aliases: ['commands', 'h'],
    category: 'utility',
    usage: 'help (command|category) (-c|-channel)',
    execute(props) {

        let { message, args, language } = props;
        const channelFlag = /\-channel\s*|-c\s*/gi
        const { commands } = message.client;
        let cmdArr = commands.array();

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
        
            let funCmds = [];
            let modCmds = [];
            let rpCmds = [];
            let setCmds = [];
            let utilCmds = [];
            let secCmds = [];
            let devCmds = [];

            for (let c of cmdArr) {
                let fun = c.category === "fun"; if (fun) funCmds.push(c.name);
                let mod = c.category === "moderation"; if (mod) modCmds.push(c.name);
                let rp = c.category === "roleplay"; if (rp) rpCmds.push(c.name);
                let set = c.category === "settings"; if (set) setCmds.push(c.name);
                let util = c.category === "utility"; if (util) utilCmds.push(c.name);
                let dev = c.category === "admin"; if (dev) devCmds.push(c.name);
                let sec = c.category === "secret"; if (sec) secCmds.push(c.name);
            };

        bigMenu = () => {

            embed
                .setTitle(language.get('COMMAND_HELP_EMBED_TITLE'))
                .setThumbnail(message.client.user.avatarURL({dynamic: true}))
                .setDescription(language.get('COMMAND_HELP_EMBED_DESCRIPTION'))
                .addField(language.get('COMMAND_HELP_EMBED_FUN', funCmds.length), funCmds.map(a => `\`${a}\``).join(", "), false)
                .addField(language.get('COMMAND_HELP_EMBED_MODERATION', modCmds.length), modCmds.map(a => `\`${a}\``).join(", "), false)
                .addField(language.get('COMMAND_HELP_EMBED_ROLEPLAY', rpCmds.length), rpCmds.map(a => `\`${a}\``).join(", "), false)
                .addField(language.get('COMMAND_HELP_EMBED_SETTINGS', setCmds.length), setCmds.map(a => `\`${a}\``).join(", "), false)
                .addField(language.get('COMMAND_HELP_EMBED_UTILITY', utilCmds.length), utilCmds.map(a => `\`${a}\``).join(", "), false)
                .addField(language.get('COMMAND_HELP_LINKS_TITLE'), language.get('COMMAND_HELP_LINKS_DESCRIPTION'))

            if (channelFlag.test(message.content)) return message.channel.send(embed)
            message.responder.success();
            return message.author.send(embed)
            .catch(() => message.channel.send(embed))
        }

        commandMenu = () => {

            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            if (!command) return message.responder.error('COMMAND_HELP_COMMAND_NOTVALID');

            if (command) {
        
                embed
                    .setTitle(command.name)
                    .setDescription(`${language.get(`COMMAND_${command.name.toUpperCase()}_DESCRIPTION`)}\n
${command.permissions? language.get('COMMAND_HELP_PERMISSIONS', command.permissions) :''}`)
                    .addField(language.get('COMMAND_HELP_USAGE'), `\`${command.usage}\``);

                if (command.aliases) embed.setTitle(`${command.name} (${command.aliases.join(', ')})`)
                if (channelFlag.test(message.content)) return message.channel.send(embed)

                message.responder.success();
                return message.author.send(embed)
                .catch(() => message.channel.send(embed))
            }
        }
        if (!args.length || channelFlag.test(args[0])) return bigMenu();
        commandMenu()
    }
}