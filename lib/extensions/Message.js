const { Structures } = require('discord.js');
const { mimuPick, clientPerms, channel, authorPerms, code } = require('../Responder');
const Responder = require('../../lib/Responder')

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
            this.responder = new Responder(this)
        }
    }
    return FoxxieMessage
})