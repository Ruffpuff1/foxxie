const { Command, util } = require('foxxie');
const { emojis } = require('../../../lib/util/constants');
const { MessageEmbed } = require('discord.js');
const { code, bold } = require('discord-md-tags');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'help',
            aliases: ['commands', 'h'],
            description: language => language.get('COMMAND_HELP_DESCRIPTION'),
            usage: 'fox help (command | usage)',
            category: 'utility',
        })
    }

    async run(msg, [command]) {

        let fullMenu = false;
        if (/(-developer|-dev|-d)/i.test(msg.content) && this.client.owners.has(msg.author)) fullMenu = true;
        command = command?.replace(/(-developer|-dev|-d)/i, '');
        const prefixes = await msg.guild.settings.get('prefixes');

        const embed = new MessageEmbed()
            .setColor(msg.guild ? msg.guild.me.displayColor : '')

        if (command) {
            if (command === 'usage') {
                return msg.channel.send(embed
                    .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(msg.language.get('COMMAND_HELP_EXPLAINER', prefixes?.length 
                        ? prefixes[0]
                        : this.client.user.id === '812546582531801118'
                            ? 'fox '
                            : 'dev '))    
                );
            }

            command = this.client.commands.get(command);
            if (command?.category === 'admin' && !this.client.owners.has(msg.author)) command = null;
            if (!command) return msg.responder.error('COMMAND_HELP_NOTVALID');

            return msg.channel.send(embed
                .setTitle(`${command.name} ${command.aliases?.length ? `(${command.aliases?.join(', ')})` : ''}`)
                .setDescription(`${util.isFunction(command.description)
                        ? command.description(msg.language)
                        : command.description
                    }${command.permissions
                        ? `\n\n${bold`${msg.language.get('COMMAND_HELP_PERMISSIONS')}`}: ${code`${command.permissions}`}`
                        : ''
                    }`)
                .addField(bold`${msg.language.get('COMMAND_HELP_USAGE')}${command.runIn?.includes('dm') ? '' : ` (${msg.language.get('COMMAND_HELP_SERVERONLY')})`}`, this.buildUsage(command, await msg.guild.settings.get('prefixes')))
                .addField(bold`${msg.language.get('COMMAND_HELP_CATEGORY')}`, code`${command.category}.${command.name}`)
                
            );
        }

        let categories = this.buildHelp();

        embed
            .setTitle(msg.language.get('COMMAND_HELP_TITLE', this.client.user.username))
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(msg.language.get('COMMAND_HELP_MENU', prefixes?.length
                    ? prefixes[0]
                    : this.client.user.id === '812546582531801118'
                        ? 'fox '
                        : 'dev '));
            
        if (!fullMenu) categories = categories.filter(c => c !== 'admin').filter(c => c !== 'secret');

        categories.forEach(c => 
            embed.addField(`${emojis.categories[c]} ${bold`${util.toTitleCase(c)} (${this.client.commands.filter(cmd => cmd.category === c).size})`}`, 
                this.client.commands.filter(cmd => cmd.category === c).map(cmd => code`${cmd.name}`).join(', ')))

        return msg.channel.send(embed);
    }

    buildHelp() {

        const categories = [];

        this.client.commands
            .forEach(cmd => categories.push(cmd.category));

        return [...new Set(categories)];
    }

    buildUsage(command, prefix) {
        const usage = command.usage;
        return `${prefix?.length
                ? prefix[0] 
                : this.client.user.id === '812546582531801118'
                    ? 'fox '
                    : 'dev '
            }${command.name} ${usage ? usage : ''}`
    }
}