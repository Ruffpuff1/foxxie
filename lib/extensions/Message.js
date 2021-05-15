const { Structures } = require('discord.js');
const Responder = require('../../lib/Responder')
const Language = require('../../lib/Language')

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
            this.responder = new Responder(this);
            this.language = new Language(this)
        }
    }
    return FoxxieMessage
})