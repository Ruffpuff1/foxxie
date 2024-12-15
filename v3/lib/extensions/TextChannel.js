const { Structures } = require('discord.js');

Structures.extend('TextChannel', Channel => {
	class FoxxieChannel extends Channel {
        constructor(guild, data) {
            super(guild, data);
        }

		async initMute(id) {
			if (!this.guild || !this.guild.roles.cache.has(id) || !this.manageable) return;

			this.updateOverwrite(id, {
				SEND_MESSAGES: false,
				ATTACH_FILES: false,
				ADD_REACTIONS: false
			}, 
            
            this.guild.language.get('COMMAND_MUTE_ROLE_REASON'));
		}

	}

	return FoxxieChannel;
});
