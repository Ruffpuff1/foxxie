module.exports = {
    name: 'tag',
    aliases: ['t', 'tags'],
    usage: 'fox tag (add|remove|list) (tag) (text)',
    permissions: 'MANAGE_MESSAGES',
    category: 'settings',
    execute: async(props) => {
        let { message, args, lang, language } = props

        if (!args[0] || args[0].toLowerCase() === 'list') return list()
        if (args[0].toLowerCase() === 'add') return add()
        if (args[0].toLowerCase() === 'remove') return remove()
        return list()

        async function add(){

            let tag = args[1]; if (!tag) return language.send('COMMAND_TAG_NOTAG', lang);
            let settings = await message.guild.settings.get('tags');
            if (settings) if (settings.filter((element) => element.name === tag.toLowerCase())[0]) return language.send('COMMAND_TAG_EXISTS', lang, tag);
            let text = args.slice(2).join(' '); if (!text) return language.send('COMMAND_TAG_NOTEXT', lang);
            let tagPush = { name: tag.toLowerCase(), text: text }
            await message.guild.settings.push('tags', tagPush)
            return language.send('COMMAND_TAG_ADDED', lang, tag.toLowerCase(), text);
        }

        async function remove(){

            let tag = args[1]; if (!tag) return language.send('COMMAND_TAG_NOTAG', lang);
            let settings = await message.guild.settings.get('tags'); if (!settings) return language.send('COMMAND_TAG_NOEXIST', lang);
            let filtered = settings.filter((element) => element.name.toLowerCase() === tag.toLowerCase())
            try { // removes tag if it exists
                await message.guild.settings.pull('tags', filtered[0]) 
                return language.send('COMMAND_TAG_REMOVED', lang, tag);
            } catch (e) { return language.send('COMMAND_TAG_NOEXIST', lang)}
        }

        async function list(){

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
}