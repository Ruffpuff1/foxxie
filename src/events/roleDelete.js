const { Event } = require('@foxxie/tails');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'roleDelete'
        })
    }

    async run(role) {
        if (!role.guild.available) return false;
        const id = await role.guild.settings.get('mod.roles.mute');
        if (role.id === id) return role.guild.settings.unset('mod.roles.mute');
        return false;
    }
}