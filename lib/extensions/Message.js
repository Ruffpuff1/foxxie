const { Structures } = require('discord.js');
const { mimuPick, clientPerms, channel, authorPerms, code } = require('../Responder');
const { english } = require('../../src/languages/en-US')

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
        }

        responder = {
            error: {
                code(message, lang){ code(message, lang) },
                authorPerms(message, lang, command){ authorPerms(message, lang, command) },
                channel(message){ channel(message) },
                clientPerms(message, permission){ clientPerms(message, permission) },
            },
            mimuPick(message){ mimuPick(message) }
        }
    }
    return FoxxieMessage
})