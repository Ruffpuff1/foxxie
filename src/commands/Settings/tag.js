const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'tag',
            aliases: ['t', 'tags'],
            description: language => language.get('COMMAND_TAG_DESCRIPTION'),
            usage: '(add | remove) (tag) (text)',
            permissions: 'MANAGE_MESSAGES',
            category: 'settings'
        })
    }

    run(_, args) {
        if (/add/i.test(args[0])) return this.add(_, args);
        if (/remove/i.test(args[0])) return this.remove(_, args);
        return this.list(_)
    }

    async add(message, [_, tag, ...text]) {
        if (!tag) return message.responder.error('COMMAND_TAG_EMPTY');
        if (!text.length) return message.responder.error('COMMAND_TAG_EMPTY');
        let tags = await message.guild.settings.get('tags');
        if (tags) if (tags.filter((element) => element.name === tag.toLowerCase())[0] || this.client.commands.get(tag))
            return message.responder.error('COMMAND_TAG_EXISTS', tag);
        
        text = text.join(' ');
        await message.guild.settings.push('tags', { name: tag.toLowerCase(), text });
        return message.responder.success('COMMAND_TAG_ADDED', tag.toLowerCase(), text);
    }

    async remove(message, [_, tag]) {
        if (!tag) return message.responder.error('COMMAND_TAG_EMPTY');
        const tags = await message.guild.settings.get('tags');
        if (!tags?.length) return message.responder.error('COMMAND_TAG_EMPTY');
        const filtered = tags.filter(element => element.name.toLowerCase() === tag.toLowerCase());

        try {
            await message.guild.settings.pull('tags', filtered[0]);
            return message.responder.success('COMMAND_TAG_REMOVED', tag);
        } catch {
            return message.responder.error('COMMAND_TAG_EMPTY');
        }
    }

    async list(message) {
        const tags = await message.guild.settings.get('tags');
        if (!tags?.length) return message.responder.error('COMMAND_TAG_NOTAGS');
        const arr = [message.language.get('COMMAND_TAG_LIST', message.guild.name, tags.length), '```asciidoc'];
        let idx = 1;
        for (let tag of tags) {
            arr.push(`${idx}. ${tag.name} :: ${tag.text.substring(0, 30).replace(/(\s{2,}|[\r\n]+)/gm, " ").replace(/(\*|\`|\\n|\~|\\)/gi, "")}`);
            idx++;
        };
        arr.push('```');
        message.channel.send(arr.join('\n'))
    }
}