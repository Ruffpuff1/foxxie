const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'anti',
            aliases: ['auto', 'am', 'auto-mod'],
            description: language => language.get('COMMAND_ANTI_DESCRIPTION'),
            usage: '(Anti | clear) (on | off)',
            permissions: 'ADMINISTRATOR',
            category: 'settings'
        })
    }

    async run(msg, [anti, setting]) {
        const loading = await msg.responder.loading();
        let use = /(invite|uppercase|gift|clear)/i.test(anti) ? anti.toLowerCase() : 'list';
        let set = /(on|off|enable|disable)/i.test(setting) ? setting.toLowerCase() : null;
        
        if (use === 'list' && !set) return this._antiList(msg, loading);
        if (use === 'clear') return this._antiClear(msg, loading);

        if (set === 'on' || set === 'enable') {
            await msg.guild.settings.set(`mod.anti.${use}`, true);
            msg.responder.success(`COMMAND_ANTI`, use, true);
            return loading.delete();
        }
        if (set === 'off' || set === 'disable') {
            await msg.guild.settings.unset(`mod.anti.${use}`);
            msg.responder.success(`COMMAND_ANTI`, use, false);
            return loading.delete();
        }
        msg.responder.error('COMMAND_ANTI_NOSETTING');
        return loading.delete();
    }

    async _antiList(msg, loading) {

        const antiChat = [], antiName = [];

        for (const anti of ['copypasta', 'duplicates', 'gift', 'image', 'invite', 'link', 'profanity']) {
            const enabled = await msg.guild.settings.get(`mod.anti.${anti}`);
            if (enabled) antiChat.push(msg.language.get('COMMAND_ANTI_ENABLED1', anti));
        }
        for (const anti of ['hoisting', 'profanity', 'unicode', 'uppercase']) {
            const enabled = await msg.guild.settings.get(`mod.anti.${anti}`);
            if (enabled) antiName.push(msg.language.get('COMMAND_ANTI_ENABLED2', anti));
        }

        const list = [ msg.language.get('COMMAND_ANTI_GUILD', msg.guild.name), antiChat.filter(a => !!a).join('\n'), antiName.filter(a => !!a).join('\n') ];
        msg.channel.send(list.filter(a => !!a).length === 1 
                ? msg.language.get('COMMAND_ANTI_NONE')
                : list.filter(a => !!a).join('\n\n'));

        return loading.delete();
    }

    async _antiClear(msg, loading) {
        function confirmed() {
            msg.guild.settings.unset("mod.anti");
            loading.delete();
            return msg.responder.success();
        }
        loading.confirm(loading, 'COMMAND_ANTI_CONFIRM', msg, confirmed);  
    }
}