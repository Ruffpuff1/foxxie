const { Monitor } = require('@foxxie/tails');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreOthers: false,
            ignoreEdits: false,
            ignoreOwner: true,
            ignoreAdmin: true
        })

        this.giftRegex = /(https?:\/\/)?(www\.)?(discord\.gift|discord(app)?\.com\/gifts)\/(\s)?.+/ui;
    }

    async run(msg) {
        if (!msg.guild || !await msg.guild.settings.get('mod.anti.gift') || await msg.exempt()) return;
        if (this.giftRegex.test(msg.content)) return msg.delete();
    }
}