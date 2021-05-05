const tc = require('tinycolor2');
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'setcolor',
    aliases: ['sc', 'setcolour'],
    usage: 'fox setcolor [role] [color]',
    category: 'utility',
    permissions: 'MANAGE_ROLES',
    execute(props) {

        let { lang, message, args } = props;
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.channel.send(lang.COMMAND_SETCOLOR_NO_ROLE)
        let color = args[1];

        const colorData = tc(color);

		if (colorData._format === false) return message.channel.send(lang.COMMAND_SETCOLOR_INVALIDCOLOR);
		role.setColor(colorData.toHex()).catch((err) => message.channel.send(lang.COMMAND_SETCOLOR_NOPERMS));

		message.react(approved)
    }
}