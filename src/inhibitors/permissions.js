const { owner } = require("../../config/foxxie");

module.exports = {
    name: 'permissions',
    async execute (props) {

        const { command, message } = props;
        // Secure commands for bot owner, will fail silently.
        if (command.permissionLevel >= 9 && !owner.includes(message.author.id)) throw true;
        // Overwrite perm level for bot owner.
        if (owner.includes(message.author.id)) return;
        // Guild Owner Only.
        if (command.permissionLevel >= 7 && message.guild.ownerID !== message.author.id) throw 'INHIBITORS_PERMISSIONS_GUILDOWNER';
        // Permissions checking.
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) throw 'INHIBITORS_PERMISSIONS_AUTHOR';
        };
    }
}