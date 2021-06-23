/**
 * Co-authored by Ruff <Ruffpuff#0017> (http://ruff.cafe)
 * Co-authored by Sami <sug4r#1312> 
 */
const { MessageEmbed } = require('discord.js');
const { Command } = require('foxxie');

class RoleplayCommand extends Command {

    constructor(name, aliases, self, ...args) {
        super(...args, {
            name,
            aliases,
            description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
            usage: `[Users] (...Text)`,
            category: 'roleplay'
        })

        this.name = name;
        this.self = self;
    }

    async run(msg, args) {

        const gifs = await this.client.settings.get(`gifs.roleplay`);
        const members = msg.members;
        const firstMember = members ? members[0] : null;
        let target = firstMember || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0]?.toLowerCase()) || msg.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0]?.toLowerCase());
        const description = [];

        let embed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor)
            .setImage(gifs[this.name][Math.floor(Math.random() * gifs[this.name].length)])

        if (members?.length > 1) return this._multiple(msg, args, members, embed, description);
        if (target) return this._single(msg, args, target, embed, description);
        if (/(me|myself|mi|self)/i.test(args[0])) return this._self(msg, embed, description);
        if (!this.self) return msg.responder.error('COMMAND_ROLEPLAY_NO_MEMBER', this.name);
        return this._alone(msg, args, embed, description);
    }

    async _multiple(msg, args, members, embed, description) {

        description.push(msg.language.get(`COMMAND_${this.name.toUpperCase()}_MULTIPLE`,
            msg.member.displayName,
            members.slice(0, -1).map(m => m.displayName).join(", ") + `** and **${members[members.length - 1].displayName}`
        ))
        let text = args.slice(members.length).join(' ');
        if (text) description.push(`"${text}"`);

        members.forEach(async m => await m.user.settings.inc(`roleplayStats.${this.name}.recieved`));
        await msg.author.settings.inc(`roleplayStats.${this.name}.given`)

        let countTar = await members[0].user.settings.get(`roleplayStats.${this.name}`);
        let countAuth = await msg.author.settings.get(`roleplayStats.${this.name}`);
        let tarRecieved = countTar ? countTar.recieved ? countTar.recieved : 0 : 0;
        let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;

        embed
            .setFooter(msg.language.get(`COMMAND_${this.name.toUpperCase()}_FOOTER`, msg.member.displayName, members[0].displayName, authorGiven.toLocaleString(), tarRecieved.toLocaleString()))
            .setDescription(description.join('\n'))

        return msg.channel.send(embed);
    }

    async _single(msg, args, target, embed, description) {

        description.push(msg.language.get(`COMMAND_${this.name.toUpperCase()}_SINGLE`, msg.member.displayName, target.displayName));
        let text = args.slice(1).join(' ');
        if (text) description.push(`"${text}"`);
        await msg.author.settings.inc(`roleplayStats.${this.name}.given`)
        await target.user.settings.inc(`roleplayStats.${this.name}.recieved`)

        let countAuth = await msg.author.settings.get(`roleplayStats.${this.name}`);
        let countTar = await target.user.settings.get(`roleplayStats.${this.name}`);
        let tarRecieved = countTar ? countTar.recieved ? countTar.recieved : 0 : 0;
        let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;

        embed
            .setFooter(msg.language.get(`COMMAND_${this.name.toUpperCase()}_FOOTER`, msg.member.displayName, target.displayName, authorGiven.toLocaleString(), tarRecieved.toLocaleString()))
            .setDescription(description.join('\n'))

        return msg.channel.send(embed);
    }

    async _self(msg, embed, description) {

        description.push(msg.language.get(`COMMAND_${this.name.toUpperCase()}_SINGLE`, msg.guild.me.displayName, msg.member.displayName));
        await msg.client.user.settings.inc(`roleplayStats.${this.name}.given`);
        await msg.author.settings.inc(`roleplayStats.${this.name}.recieved`);

        let countAuth = await this.client.user.settings.get(`roleplayStats.${this.name}`);
        let countTar = await msg.author.settings.get(`roleplayStats.${this.name}`);
        let tarRecieved = countTar ? countTar.recieved ? countTar.recieved : 0 : 0;
        let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;

        embed
            .setFooter(msg.language.get(`COMMAND_${this.name.toUpperCase()}_FOOTER`, msg.guild.me.displayName, msg.member.displayName, authorGiven.toLocaleString(), tarRecieved.toLocaleString()))
            .setDescription(description.join('\n'))

        return msg.channel.send(embed)
    }

    async _alone(msg, args, embed, description) {

        description.push(`**${msg.member.displayName}** ${msg.language.get(`COMMAND_${this.name.toUpperCase()}_SELF`)}`)
        let text = args.slice(0).join(' ');
        if (text) description.push(`"${text}"`);

        let countAuth = await msg.author.settings.get(`roleplayStats.${this.name}`);
        let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;

        embed
            .setDescription(description.join('\n'))
            .setFooter(`${msg.member.displayName} has ${this.name === 'sleep' ? 'slept' : `${this.name}ed`} ${authorGiven} times`)

        return msg.channel.send(embed)
    }
}

module.exports = RoleplayCommand;