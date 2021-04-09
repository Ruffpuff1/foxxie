const Discord = require('discord.js')
module.exports = {
    name: 'help',
    aliases: ['commands', 'h'],
    description: 'Display help for a command when a command is specified or with no command will provide a list of all commands.',
    usage: 'help (command)',
    execute(lang, message, args, client) {
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle(lang.COMMAND_HELP_TITLE)
            .setDescription(lang.COMMAND_HELP_DESCRIPTION)
            .setColor(message.guild.me.displayColor)
            .setThumbnail(client.user.displayAvatarURL( { dynamic: true } ))
            .addFields(
                {
                    name: lang.COMMAND_HELP_FUN,
                    value: "`blush`, `bonk`, `boop`, `cat`, `cry`, `cuddle`, `dab`, `dog`, `facepalm`, `fox`, `hug`, `pat`, `pokemon`, `urban`",
                    inline: false
                },
                {
                    name: lang.COMMAND_HELP_MODERATION,
                    value: "`clearnote`, `clearwarn`, `note`, `nuke`, `warn`",
                    inline: false
                },
                /*
                {
                    name: lang.COMMAND_HELP_ROLEPLAY,
                    value: "`blush`, `bonk`, `boop`, `cry`, `cuddle`, `dab`, `facepalm`, `hug`, `pat`",
                    inline: false
                },
                */
                {
                    name: lang.COMMAND_HELP_SETTINGS,
                    value: "`disboardchannel`, `disboardmessage`, `language`, `modchannel`, `testjoin`, `welcomechannel`",
                    inline: false
                },
                {
                    name: lang.COMMAND_HELP_UTILITY,
                    value: "`about`, `afk`, `avatar`, `bugreport`, `corona`, `define`, `embed`, `help`, `info` `invite`, `ping`, `poll`, `remindme`, `say`, `setcolor`, `steal`, `support`, `uptime`, `weather`, `wolfram`",
                    inline: false
                },
                {
                    name: lang.COMMAND_ABOUT_LINKS,
                    value: lang.COMMAND_ABOUT_LINKS_LINKS,
                    inline: false
                }
            )

            let descriptions = lang.COMMAND_DESCRIPTIONS

        const data = [];
        const { commands } = message.client;


        if (!args.length) {

            data.push(helpEmbed);
            message.react('✅')
            return message.author.send(data, { split: true }).then(() => {
            if (message.channel.type === 'dm') return;
            })
            .catch(error => {console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            
            return message.channel.send(helpEmbed)})
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command && message.content.includes('-c')) {
            return message.channel.send(helpEmbed)
        }

        if (command) {
        
            let commandUp = command.name.toUpperCase()

            const helpCommandEmbed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setTitle(command.name)
                .setDescription(`${descriptions[commandUp]}\n\n${command.permissions?`**Permissions Required:** \`${command.permissions}\``:''}`)
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