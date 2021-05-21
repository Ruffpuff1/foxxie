module.exports = {
    name: 'tag',
    aliases: ['t', 'tags'],
    usage: 'fox tag (add|remove|list) (tag) (text)',
    permissions: 'MANAGE_MESSAGES',
    category: 'settings',
    async execute (props) {
        let { args } = props;

        if (!args[0] || args[0].toLowerCase() === 'list') return this._list(props);
        if (args[0].toLowerCase() === 'add') return this._add(props);
        if (args[0].toLowerCase() === 'remove') return this._remove(props);
        return this._list(props);
    }, 

    async _add({ message, args, language, lang }){

        let tag = args[1]; if (!tag) return language.send('COMMAND_TAG_NOTAG', lang);
        let settings = await message.guild.settings.get('tags');
        if (settings) if (settings.filter((element) => element.name === tag.toLowerCase())[0]) return language.send('COMMAND_TAG_EXISTS', lang, tag);
        let text = args.slice(2).join(' '); if (!text) return language.send('COMMAND_TAG_NOTEXT', lang);
        let tagPush = { name: tag.toLowerCase(), text: text }
        await message.guild.settings.push('tags', tagPush)
        return language.send('COMMAND_TAG_ADDED', lang, tag.toLowerCase(), text);
    },

    async _remove({ message, args, language, lang }){

        let tag = args[1]; if (!tag) return language.send('COMMAND_TAG_NOTAG', lang);
        let settings = await message.guild.settings.get('tags'); if (!settings) return language.send('COMMAND_TAG_NOEXIST', lang);
        let filtered = settings.filter((element) => element.name.toLowerCase() === tag.toLowerCase())
        try { // removes tag if it exists
            await message.guild.settings.pull('tags', filtered[0]) 
            return language.send('COMMAND_TAG_REMOVED', lang, tag);
        } catch (e) { return language.send('COMMAND_TAG_NOEXIST', lang)}
    }, 

    async _list({ message, language, lang }){

        let set = await message.guild.settings.get('tags');
        if (!set.length) return language.send('COMMAND_TAGS_NONE');
        let arr = [language.get('COMMAND_TAGS_LIST', lang, message.guild.name, set.length), '```asciidoc']
        let idx = 1
        for(let tag of set){
            arr.push(`${idx}. ${tag.name} :: ${tag.text.substring(0, 30).replace(/(\s{2,}|[\r\n]+)/gm, " ").replace(/(\*|\`|\\n|\~|\\)/gi, "")}`)
            idx++
        }
        arr.push('```');
        message.channel.send(arr.join('\n'))
    }
}