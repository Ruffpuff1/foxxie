const mongo = require('../../../lib/structures/database/mongo')
const { serverSchema } = require('../../../lib/structures/schemas')
const { emojis: { approved } } = require('../../../lib/util/constants')
module.exports = {
    name: 'permission',
    aliases: ['permissions', 'perms', 'perm'],
    usage: 'fox permission [allow|deny|clear] (user|userId)',
    category: 'settings',
    permissions: 'ADMINISTRATOR',
    execute: async (lang, message, args) => {
        use = args[0];
        mem = message.mentions.members.first() || message.guild.members.cache.get(args[1]);

        await mongo().then(async () => {
            try {
                if (!use) return message.channel.send('**Please,** specify a proper use case, either **allow**, **deny**, or **clear**.')
                if (use?.toLowerCase() === 'deny') {
                    if (!mem) return message.channel.send('**You need to** give either a user mention, or user ID for who you wanna perforn this action on.')
                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        $push: {
                            blockedUsers: mem.user.id
                        }
                    }, {
                        upsert: true
                    })
                    message.react(approved)
                } else if (use?.toLowerCase() === 'allow') {
                    if (!mem) return message.channel.send('**You need to** give either a user mention, or user ID for who you wanna perforn this action on.')
                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        $pull: {
                            blockedUsers: mem.user.id
                        }
                    }, {
                        upsert: true
                    })
                    message.react(approved)
                } else if (use?.toLowerCase() === 'clear') {


                    await serverSchema.findByIdAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        $unset: {
                            blockedUsers: ''
                        }
                    })
                    message.react(approved)
                } else message.channel.send('**Please,** specify a proper use case, either **allow**, **deny**, or **clear**.')

            } finally {}
        })
    }
}