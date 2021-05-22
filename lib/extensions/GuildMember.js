const { Structures } = require('discord.js');

Structures.extend('GuildMember', GuildMember => {
    class FoxxieMember extends GuildMember {

        constructor(client, data, guild) {
            super(client, data, guild);
            
        }

        async mute(reason, id) {
            if (!id) id = await this.guild.settings.get('mod.roles.mute');
            if (!id) return this;
            if (this.guild.roles.cache.get(id)) this.roles.add(id, reason);
			return this;
        }
    }

    return FoxxieMember;
})