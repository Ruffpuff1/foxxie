const { prefix: { production, development } } = require('../../config/foxxie')
module.exports = {
    name: 'regexTags',
    execute: async(message) => {

        let settings = await message.guild.settings.get()
        if (!settings) return;
        if (settings.tags) tag()

        async function tag(){
            let prefix = message.client.user.id === '825130284382289920' ? development : production
            if (settings.prefix) prefix = settings.prefix

            if (!message.content.startsWith(prefix)) return
            for (let tag of settings.tags){
                if (message.content.startsWith(`${prefix}${tag['name']}`))
                message.channel.send(tag['text'].replace(/\\n*(\s*)?/gi, "\n").replace(/{(member|user|mention)}/gi, message.member.toString()))
            }
        }
    }
}