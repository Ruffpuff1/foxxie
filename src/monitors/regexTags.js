const { prefix: { production, development } } = require('../../config/foxxie')
module.exports = {
    name: 'regextags',
    execute: async(message) => {
        
        let settings = await message.guild.settings.get()
        if (settings?.tags) return tag();

        async function tag(){

            let prefixes = ['fox'];
            if (!settings?.prefixes.length) prefixes.push(message.client.user.id === '825130284382289920' ? development : production);
            if (settings?.prefixes.length) settings?.prefixes.forEach(p => prefixes.push(p));

            prefixes.forEach(p => {
                if (message.content.startsWith(p)) return sendTag(p)
            })

            function sendTag(p) {
                for (let tag of settings.tags){
                    if (message.content.replace(/ /g, "").startsWith(`${p}${tag['name']}`))
                    message.channel.send(tag['text'].replace(/\\n*(\s*)?/gi, "\n").replace(/{(member|user|mention)}/gi, message.member.toString()))
                }
            }
        }
    }
}