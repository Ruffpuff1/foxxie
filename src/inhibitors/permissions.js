module.exports = {
    name: 'permissions',
    async execute (command, message) {
        
        // Secure commands for bot owner, will fail silently.
        if (command.permissionLevel >= 9 && !message.client.owners.has(message.author)) throw true;
        // Overwrite perm level for bot owner.
        if (message.client.owners.has(message.author)) return;
        // Guild Owner Only.
        if (command.permissionLevel >= 7 && message.guild.ownerID !== message.author.id) throw 'INHIBITORS_PERMISSIONS_GUILDOWNER';
        // Permissions checking.
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) throw 'INHIBITORS_PERMISSIONS_AUTHOR';
        };
    }
}