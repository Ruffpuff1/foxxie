const tc = require('tinycolor2');
module.exports = {
    name: 'setcolor',
    aliases: ['sc', 'setcolour'],
    usage: 'fox setcolor [role] [color]',
    category: 'utility',
    permissions: 'MANAGE_ROLES',
    execute(props) {

        let { message, args} = props;
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.responder.error('COMMAND_SETCOLOR_NOROLE');
        let color = args[1];

        const colorData = tc(color);

		if (colorData._format === false) return message.responder.error('COMMAND_SETCOLOR_INVALIDCOLOR');
		role.setColor(colorData.toHex()).catch(() => message.responder.error('COMMAND_SETCOLOR_NOPERMS'));

		message.responder.success();
    }
}