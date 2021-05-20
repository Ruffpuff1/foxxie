const { prefix: { production, development } } = require('../../config/foxxie')
module.exports = {
    name: 'tags',
    type: 'message',
    async execute (message) {
        
        let settings = await message.guild.settings.get()
        if (settings?.tags) return this._tag(message, settings);
    },

    async _tag(message, settings){

        let prefixes = [];
        message.client.user.id === '825130284382289920' ? prefixes.push('dev') : prefixes.push('fox');
        if (!settings?.prefixes.length) prefixes.push(message.client.user.id === '825130284382289920' ? development : production);
        if (settings?.prefixes.length) settings?.prefixes.forEach(p => prefixes.push(p));

        prefixes.forEach(p => {
            if (message.content.startsWith(p)) return this._sendTag(p, message, settings)
        })
    },

    _sendTag(p, message, settings) {
        for (let tag of settings.tags){
            if (message.content.replace(/ /g, "") === `${p}${tag['name']}`)
            message.channel.send(tag['text'].replace(/\\n*(\s*)?/gi, "\n").replace(/{(member|user|mention)}/gi, message.member.toString()))
        }
    }
}