const { Inhibitor } = require('@foxxie/tails');

module.exports = class extends Inhibitor {

    constructor(...args) {
        super(...args, {
            name: 'permissions'
        })
    }

    async run(message, command) {
        await message.guild?.members.fetch(message.guild.ownerID).catch(() => null);
        // Secure commands for bot owner, will fail silently.
        if (command.permissionLevel >= 10 && !message.client.owners.has(message.author)) throw true;
        // Overwrite perm level for bot owner.
        if (message.client.owners.has(message.author)) return;
        // Secure commands for contributors,
        if (command.permissionLevel >= 9 && !this.client.contributors.has(message.author)) throw true;
        // permission system doesn't work in dms
        if (!message.guild) return;
        // only in guilds owned by a bot owner
        if (command.permissionLevel >= 8 && !this.client.options.owners.includes(message.guild.ownerID)) throw true;
        // only in guilds owned by a contributor
        if (command.permissionLevel >= 7 && !this.client.contributors.has(message.guild.owner.user)) throw true;
        // Guild Owner Only.
        if (command.permissionLevel === 6 && message.guild.ownerID !== message.author.id) throw message.language.get('INHIBITOR_PERMISSIONS_GUILDOWNER');
        // Permissions checking.
        if (command.permissions && command.permissions !== 'CLIENT_OWNER' && command.permissions !== 'GUILD_OWNER') {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) throw message.language.get('INHIBITOR_PERMISSIONS_AUTHOR', command.permissions?.toLowerCase()?.replace(/_/g, ' '));
        };
    }
}