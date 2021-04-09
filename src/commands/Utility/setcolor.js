const tc = require('tinycolor2');
module.exports = {
    name: 'setcolor',
    aliases: ['sc'],
    guildOnly: true,
    usage: 'fox setcolor [role] [color]',
    permissions: 'MANAGE_ROLES',
    execute(lang, message, args) {
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.channel.send("no role")
        let color = args[1];

        const colorData = tc(color);

		if (colorData._format === false) return message.channel.send('COMMAND_SETCOLOR_INVALIDCOLOR');
		role.setColor(colorData.toHex()).catch((err) => message.channel.send('COMMAND_SETCOLOR_NOPERMS'));

		message.react("✅")
    }
}