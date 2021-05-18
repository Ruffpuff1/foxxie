const tc = require('tinycolor2');
module.exports = {
    name: 'setcolor',
    aliases: ['sc', 'setcolour'],
    usage: 'fox setcolor [role] [color]',
    category: 'utility',
    permissions: 'MANAGE_ROLES',
    execute(props) {

        let { lang, message, args, language} = props;
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return language.send('COMMAND_SETCOLOR_NOROLE', lang);
        let color = args[1];

        const colorData = tc(color);

		if (colorData._format === false) return language.send('COMMAND_SETCOLOR_INVALIDCOLOR', lang);
		role.setColor(colorData.toHex())
        .catch(e => language.send('COMMAND_SETCOLOR_NOPERMS', lang));

		message.responder.success();
    }
}