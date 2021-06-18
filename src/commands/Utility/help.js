const { Command, Util, code, bold } = require('foxxie');
const { emojis } = require('../../../lib/util/constants');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'help',
            aliases: ['commands', 'h'],
            description: language => language.get('COMMAND_HELP_DESCRIPTION'),
            usage: 'fox help (Command | usage)',
            category: 'utility',
        })
    }

    async run(msg, [command]) {

        let fullMenu = false;
        if (/(-developer|-dev|-d)/i.test(msg.content) && this.client.owners.has(msg.author)) fullMenu = true;
        command = command?.replace(/(-developer|-dev|-d)/i, '');
        const prefixes = await msg.guild.settings.get('prefixes');
        const blocked = await this.client.settings?.get('blockedPieces')

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
        
            command = this.client.commands?.get(command);
            if ((blocked?.includes(command?.name) && !this.client.owners.has(msg.author)) || (command?.category === 'admin' && !this.client.owners.has(msg.author))) command = null;
            if (!command) return msg.responder.error('COMMAND_HELP_NOTVALID');

            return msg.channel.send(embed
                .setTitle(`${command.name} ${command.aliases?.length ? `(${command.aliases?.join(', ')})` : ''}`)
                .setDescription(`${Util.isFunction(command.description)
                        ? command.description(msg.language)
                        : command.description
                    }${command.permissions && command.permissions !== 'GUILD_OWNER' && command.permissions !== 'CLIENT_OWNER'
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
                        : 'dev ', this.client.commands.size));
            
        if (!fullMenu) categories = categories.filter(c => c !== 'admin').filter(c => c !== 'secret').filter(cmd => !(cmd.permissions === 'CLIENT_OWNER'));

        categories.forEach(c => 
            embed.addField(`${emojis.categories[c]} ${bold`${Util.toTitleCase(c)} (${this.client.commands.array().filter(cmd => cmd.category === c).filter(cmd => !blocked?.includes(cmd.name)).length})`}`, 
                this.client.commands.array().filter(cmd => cmd.category === c).filter(cmd => !blocked?.includes(cmd.name)).map(cmd => code`${cmd.name}`).join(', ')))

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