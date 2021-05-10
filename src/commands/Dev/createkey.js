const { owner } = require("../../../config/foxxie");
const { botSettingsSchema } = require("../../../lib/structures/database/BotSettingsSchema")
const mongo = require("../../../lib/structures/database/mongo")
const { emojis: { approved } } = require('../../../lib/util/constants')

const { randomBytes } = require('crypto');
const { base32 } = require('../../../lib/util/util');
const { badges } = require('../../../lib/util/constants');

module.exports = {
    name: 'createkey',
    aliases: ['crk'],
    category: 'developer',
    usage: 'fox createkey [id]',
    execute: async (props) => {

        let { message, args, language, lang } = props
        if (!owner.includes(message.author.id)) return;

        const id = args[0]
        if (!/^(0|1|2|3|4)$/gm.test(id)) return message.channel.send(language.get('COMMAND_CREATEKEY_NOID', lang, badges))

        const out = [];
        for (let i =0; i < 3; i++) {
            const str = base32(randomBytes(3).readUIntLE(0, 3));
            out.push(str);
        }
        await message.author.send(language.get('COMMAND_CREATEKEY_SUCCESS', lang, badges, id, out));
        await mongo().then(async () => {
            try { await botSettingsSchema.findByIdAndUpdate(
                { _id: '812546582531801118' },
                { _id: '812546582531801118',
                    $push: { keys: { id, key: out.join('') } } }, 
                { upsert: true })
            } finally {}
        })
        return message.react(approved)
    }
}