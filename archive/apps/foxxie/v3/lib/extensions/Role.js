const { Structures } = require('discord.js');

Structures.extend('Role', Role => {
    class FoxxieRole extends Role {

        constructor(client, data, guild) {
            super(client, data, guild);
            
        }

        memberList(map) {
            return this.members.size > 0 ? this.members.map(member => member[map] || member.user.username).join(', ') : 'No Members';
        }
    }

    return FoxxieRole;
})