const Discord = require('discord.js');
const Command = require('../../../lib/structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'serverlist',
            aliases: ['sl'],
            description: language => language.get('COMMAND_SERVERLIST_DESCRIPTION'),
            permissionLevel: 9,
            category: 'admin',
        })
    }

    async run(message) {

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        let description = this.client.guilds.cache
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .map(r => r)
            .map((r, i) => `**${i + 1}**. ${r.name} (ID: ${r.id}) | **${r.memberCount}** ${message.language.get('COMMAND_SERVERLIST_MEMBERCOUNT')}`)
            .slice(0, 10)
            .join("\n")

        let embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(message.language.get('COMMAND_SERVERLIST_EMBED_TITLE'))
            .setFooter(message.language.get('COMMAND_SERVERLIST_EMBED_FOOTER', this.client.guilds.cache.size, page, Math.ceil(this.client.guilds.cache.size / 10)))
            .setDescription(description)

        if (!this.client.guilds.cache.size <= 10) return message.channel.send(embed);
        let msg = await message.channel.send(embed);
        this.menuReactions(msg, { i0, i1, page });
    }

    async menuReactions(msg, { i0, i1, page }) {

        await msg.react("⬅");
        await msg.react("➡");

        let collector = msg.createReactionCollector((reaction, user) => user.id === msg.author.id)

        collector.on('collect', async reaction => {

            if (reaction._emoji.name === "⬅") {

                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;

                if (i0 + 1 < 0) return msg;
                if (!i0 || !i1) return msg;

                description = this.client.guilds.cache
                    .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                    .map(r => r)
                    .map((r, i) => `**${i + 1}**. ${r.name} (ID: ${r.id}) | **${r.memberCount}** ${msg.language.get('COMMAND_SERVERLIST_MEMBERCOUNT')}`)
                    .slice(i0, i1)
                    .join("\n");

                embed 
                    .setFooter(msg.language.get('COMMAND_SERVERLIST_EMBED_FOOTER', this.client.guilds.cache.size, page, Math.ceil(this.client.guilds.cache.size / 10)))
                    .setDescription(description)

                msg.edit(embed);
            }

            if (reaction._emoji.name === "➡") {

                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                if (i1 > this.client.guilds.cache.size + 10) return msg;
                if (!i0 || i1) return msg;

                description = this.client.guilds.cache
                    .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                    .map(r => r)
                    .map((r, i) => `**${i + 1}**. ${r.name} (ID: ${r.id}) | **${r.memberCount}** ${msg.language.get('COMMAND_SERVERLIST_MEMBERCOUNT')}`)
                    .slice(i0, i1)
                    .join("\n");

                embed
                    .setFooter(msg.language.get('COMMAND_SERVERLIST_EMBED_FOOTER', this.client.guilds.cache.size, page, Math.ceil(this.client.guilds.cache.size / 10)))
                    .setDescription(description);

                msg.edit(embed);
            }
        })
    }
}