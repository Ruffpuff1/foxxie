const { Structures } = require('discord.js');
const db = require('quick.db')
const mongo = require('../structures/database/mongo')
const messageCountSchema = require('../structures/database/schemas/server/messageCountSchema')
const serverMessageCountSchema = require('../structures/database/schemas/server/serverMessageCountSchema')
Structures.extend('Message', Message => {
  class FoxxieMessage extends Message {
    constructor(client, data, channel) {
      super(client, data, channel);
      this.MessageCount();
    }

    async MessageCount() {
        if (!this.guild) return;
        await mongo().then(async mongoose => {
            try {
                await messageCountSchema.findOneAndUpdate({
                    guildId: this.guild.id,
                    userId: this.member?.user.id
                }, {
                    $inc: {
                        'messageCount': 1
                    }
                }, {
                    upsert: true
                }).exec()
                await serverMessageCountSchema.findOneAndUpdate({
                    guildId: this.guild.id
                }, {
                    $inc: {
                        'messageCount': 1
                    }
                }, {
                    upsert: true
                })
            } finally {}
        })
    }
  }

  return FoxxieMessage;
});