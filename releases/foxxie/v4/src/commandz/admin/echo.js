const { FoxxieCommand } = require('#structures');
const { Promises: { resolveToNull }, Messages: { sendTemporaryMessage } } = require('#util');
const { t } = require('#i18n');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            permissionLevel: 10,
            usage: '[Channel:sendablechannel] [Text:str] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [channel = msg.channel, ...text]) {
        resolveToNull(msg.delete());

        const attachment = msg.attachments.size ? msg.attachments.first().url : null;

        if (!text.length && !attachment) {
            return sendTemporaryMessage(msg, t(msg, this.t.noContent, { user: msg.author.username }));
        }
        const options = {};
        if (text.length) options.content = text.join(' ');
        if (attachment) options.files = [{ attachment }];

        await channel.send(options);
        if (channel !== msg.channel) await sendTemporaryMessage(msg, t(msg, this.t.success, { channel: channel.toString() }));

        return msg;
    }

};