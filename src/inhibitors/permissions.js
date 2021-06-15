const { Inhibitor } = require('foxxie');

module.exports = class extends Inhibitor {

    constructor(...args) {
        super(...args, {
            name: 'permissions'
        })
    }

    run(message, command) {

        // Secure commands for bot owner, will fail silently.
        if (command.permissions === 'CLIENT_OWNER' && !message.client.owners.has(message.author)) return true;
        // Overwrite perm level for bot owner.
        if (message.client.owners.has(message.author)) return false;
        // Guild Owner Only.
        if (command.permissions === 'GUILD_OWNER' && message.guild.ownerID !== message.author.id) throw message.language.get('INHIBITOR_PERMISSIONS_GUILDOWNER');
        // Permissions checking.
        if (command.permissions && command.permissions !== 'CLIENT_OWNER' && command.permissions !== 'GUILD_OWNER') {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) throw message.language.get('INHIBITOR_PERMISSIONS_AUTHOR', command.permissions?.toLowerCase()?.replace(/_/g, ' '));
        };
    }
}