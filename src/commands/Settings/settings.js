const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'settings',
            aliases: ['setting'],
            description: language => language.get('COMMAND_SETTINGS_DESCRIPTION'),
            permissions: 'MANAGE_MESSAGES',
            category: 'settings',
        })
    }

    async run(msg) {
        const loading = await msg.responder.loading();
        const settings = await msg.guild.settings.get();

        await settings.mod?.exempt?.users?.forEach(async u => {
            await this.client.users.fetch(u)
        });

        const description = [
            msg.language.get('COMMAND_SETTINGS_GUILD', this.client.user.username, msg.guild.name),
            msg.language.get('COMMAND_SETTINGS_ARRAY',
                settings.prefixes?.length,
                settings.prefixes?.map(p => `\`${p}\``).join(', '),
                msg.guild.channels.cache.get(settings.welcome?.channel),
                msg.guild.channels.cache.get(settings.goodbye?.channel),
                msg.guild.channels.cache.get(settings.disboard?.channel),
                msg.guild.channels.cache.get(settings.starboard?.channel),
                settings.log ? Object.keys(settings.log)?.length : null,
                msg.guild.channels.cache.get(settings.log?.mod?.channel),
                msg.guild.channels.cache.get(settings.log?.edit?.channel),
                msg.guild.channels.cache.get(settings.log?.delete?.channel),
                msg.guild.channels.cache.get(settings.log?.member?.channel),
            ),
            msg.language.get('COMMAND_SETTINGS_ANTI',
                settings.mod?.anti ? Object.keys(settings.mod?.anti)?.length : null,
                settings.mod?.anti?.copypasta,
                settings.mod?.anti?.duplicates,
                settings.mod?.anti?.gift,
                settings.mod?.anti?.image,
                settings.mod?.anti?.invite,
                settings.mod?.anti?.link,
                settings.mod?.anti?.profanity,
                settings.mod?.anti?.hoisting,
                settings.mod?.anti?.unicode,
                settings.mod?.anti?.uppercase
            ),
            msg.language.get('COMMAND_SETTINGS_EXEMPT',
            
                settings.mod?.exempt?.users ? Object.keys(settings.mod?.exempt?.users).length : null,
                settings.mod?.exempt?.users?.map(u => {
                    const user = this.client.users.cache.get(u);
                    if (user) return `**${user.tag}**`;
                    return user
                }).filter(a => !!a).join(', '),
                settings.mod?.exempt?.channels ? Object.keys(settings.mod?.exempt?.channels).length : null,
                settings.mod?.exempt?.channels?.map(c => {
                    const channel = msg.guild.channels.cache.get(c);
                    if (channel) return `**${channel.name}**`;
                    return channel
                }).filter(a => !!a).join(', '),

                settings.mod?.exempt?.roles ? Object.keys(settings.mod?.exempt?.roles).length : null,
                settings.mod?.exempt?.roles?.map(r => {
                    const role = msg.guild.roles.cache.get(r);
                    if (role) return `**${role.name}**`;
                    return role
                }).filter(a => !!a).join(', ')
            )
        ];

        msg.channel.send(description.filter(a => !!a).length === 1
                ? msg.language.get('COMMAND_SETTINGS_NONE')
                : description.filter(a => !!a).join('\n\n'))
            
        loading.delete();
    }
}