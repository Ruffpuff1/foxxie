// need major rework
const { Permissions: { FLAGS } } = require('discord.js');
const { ModerationBitfield } = require('#moderation');
const { Util: { andArray } } = require('#util');
const { FoxxieCommand } = require('#structures');
const { sendSuccess, sendError, sendLoading, send } = require('#messages');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            requiredPermissions: [FLAGS.MANAGE_MESSAGES],
            aliases: ['anti', 'am'],
            usage: `[invite|gift|uppercase] [enable|disable]`,
            usageDelim: ' ',
            permissions: [FLAGS.MANAGE_MESSAGES]
        });
    }

    async run(msg, [type, action]) {
        if (!action) return this.displaySettings(msg, type);
        if (!type) return sendError(msg, 'COMMAND_AUTOMOD_NOTYPE');
        const loading = await sendLoading(msg);
        await msg.guild.settings.sync();
        await msg.guild.settings.set(`anti.${type}`, action === 'enable');
        await sendSuccess(msg, 'COMMAND_AUTOMOD_SUCCESS', type, action === 'enable', ['hoisting', 'unmentionable', 'uppercase'].includes(type));
        return loading.delete();
    }

    async displaySettings(msg, type) {
        if (type) return this.displayOne(msg, type);
        else {
            const loading = await sendLoading(msg);
            const out = [];
            out.push(msg.language.get('COMMAND_AUTOMOD_DISPLAY_TITLE', msg.guild.name));
            out.push('');
            for (const anti of ['invite', 'gift']) {
                const enabled = msg.guild.settings.get(`mod.anti.${anti}`);
                out.push(msg.language.get('COMMAND_AUTOMOD_DISPLAY_ALL_CHAT', ['invite', 'gift'].includes(anti) ? `${anti}s` : anti, enabled));
            }
            out.push('');
            for (const anti of ['uppercase']) {
                const enabled = msg.guild.settings.get(`mod.anti.${anti}`);
                out.push(msg.language.get('COMMAND_AUTOMOD_DISPLAY_ALL_USERS', anti, enabled));
            }
            await send(msg, out.join('\n'));
            return loading.delete();
        }
    }

    displayOne(msg, type) {
        const enabled = msg.guild.settings.get(`mod.anti.${type}`);
        const softPunishArray = this.getSoftPunishArray(msg, type);
        const hardPunishData = this.getHardPunishData(msg, type);

        return send(msg, [
            msg.language.get('COMMAND_AUTOMOD_DISPLAY_ONE', ['invite', 'gift'].includes(type) ? `${type}s` : type, enabled),
            softPunishArray.length ? ` └─ ${andArray(softPunishArray)}` : null,
            hardPunishData ? ` └─ ${hardPunishData}` : null
        ].filter(a => !!a).join('\n'));
    }

    getHardPunishData(msg, type) {
        let hardPunishNum = msg.guild.settings.get(`mod.automod.${type}.hardPunish`);
        if (!hardPunishNum || isNaN(hardPunishNum)) hardPunishNum = 0;

        switch (3) {
        case ModerationBitfield.HardActionFlags.None:
            return null;
        case ModerationBitfield.HardActionFlags.Warning:
            return msg.language.get('COMMAND_AUTOMOD_WARNING');
        case ModerationBitfield.HardActionFlags.Kick:
            return msg.language.get('COMMAND_AUTOMOD_KICK');
        case ModerationBitfield.HardActionFlags.Mute:
            return msg.language.get('COMMAND_AUTOMOD_MUTE');
        case ModerationBitfield.HardActionFlags.SoftBan:
            return msg.language.get('COMMAND_AUTOMOD_SOFTBAN');
        case ModerationBitfield.HardActionFlags.Ban:
            return msg.language.get('COMMAND_AUTOMOD_BAN');
        }

        return null;
    }

    getSoftPunishArray(msg, type) {
        let softPunishNum = msg.guild.settings.get(`mod.automod.${type}.softPunish`);
        if (!softPunishNum || isNaN(softPunishNum)) softPunishNum = 0;

        const softPunishBitfield = new ModerationBitfield(softPunishNum);
        const softPunishArray = [];

        for (const key in ModerationBitfield.FLAGS) {
            if (softPunishBitfield.has(key)) softPunishArray.push(msg.language.get(`COMMAND_AUTOMOD_${key}`));
        }

        return softPunishArray;
    }


};