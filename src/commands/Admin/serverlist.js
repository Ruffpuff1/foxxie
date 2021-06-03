const Discord = require('discord.js');
module.exports = {
    name: 'serverlist',
    aliases: ['sl'],
    usage: 'fox serverlist',
    permissionLevel: 9,
    category: 'admin',
    execute: async ({ message, language }) => {

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        let description = message.client.guilds.cache
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .map(r => r)
            .map((r, i) => `**${i + 1}**. ${r.name} (**ID:** ${r.id}) | **${r.memberCount}** ${language.get('COMMAND_SERVERLIST_MEMBERCOUNT')}`)
            .slice(0, 10)
            .join("\n");

        let embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(language.get('COMMAND_SERVERLIST_EMBED_TITLE'))
            .setFooter(language.get('COMMAND_SERVERLIST_EMBED_FOOTER', message.client.guilds.cache.size, page, Math.ceil(message.client.guilds.cache.size / 10)))
            .setDescription(description);

        let msg = await message.channel.send(embed);

        await msg.react("⬅");
        await msg.react("➡");
        await msg.react("834628295303495681");

        let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id)

        collector.on("collect", async (reaction) => {

            if (reaction._emoji.name === "⬅") {
                // Updates variables
                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;
                // if there is no guild to display, delete the message
                if (i0 + 1 < 0) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }
      
            description = message.client.guilds.cache
                .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                .map(r => r)
                .map((r, i) => `**${i + 1}**. ${r.name} (**ID:** ${r.id}) | **${r.memberCount}** ${language.get('COMMAND_SERVERLIST_MEMBERCOUNT')}`)
                .slice(i0, i1)
                .join("\n");

            embed
                .setFooter(language.get('COMMAND_SERVERLIST_EMBED_FOOTER', message.client.guilds.cache.size, page, Math.ceil(message.client.guilds.cache.size / 10)))
                .setDescription(description);
                // Edit the message
            msg.edit(embed);
            }
      
            if (reaction._emoji.name === "➡") {
                // Updates variables
            i0 = i0 + 10;
            i1 = i1 + 10;
            page = page + 1;
            // if there is no guild to display, delete the message
                if (i1 > message.client.guilds.cache.size + 10) {
                  return msg.delete();
                }
                if (!i0 || !i1) {
                  return msg.delete();
                }
            description = message.client.guilds.cache
                .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                .map(r => r)
                .map((r, i) => `**${i + 1}**. ${r.name} (**ID:** ${r.id}) | **${r.memberCount}** ${language.get('COMMAND_SERVERLIST_MEMBERCOUNT')}`)
                .slice(i0, i1)
                .join("\n");
            // Update the embed with new informations
            embed
                .setFooter(language.get('COMMAND_SERVERLIST_EMBED_FOOTER', message.client.guilds.cache.size, page, Math.ceil(message.client.guilds.cache.size / 10)))
                .setDescription(description);
            // Edit the message
            msg.edit(embed);
            }
            if (reaction._emoji.id === "834628295303495681") {
                return msg.delete();
            }
        // Remove the reaction when the user react to the message
            await reaction.users.remove(message.author.id);
        }) 
        
        
    }
}