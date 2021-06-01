const { randomBytes } = require('crypto');
const { base32 } = require('../../../lib/util/util');
const { badges } = require('../../../lib/util/constants');

module.exports = {
    name: 'createkey',
    aliases: ['crk'],
    category: 'admin',
    usage: 'fox createkey [id]',
    permissionLevel: 9,
    execute: async ({ message, args, language }) => {

        const id = args[0]
        if (!/^(0|1|2)$/gm.test(id)) return message.responder.error('COMMAND_CREATEKEY_NOID', badges);

        const out = [];
        for (let i = 0; i < 3; i++) {
            const str = base32(randomBytes(3).readUIntLE(0, 3));
            out.push(str);
        }
        message.author.send(language.get('COMMAND_CREATEKEY_SUCCESS', badges, id, out));
        message.client.framework.push(`keys`, { id, key: out.join('') });
        message.responder.success();
    }
}