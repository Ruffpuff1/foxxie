const { Command, Util } = require('foxxie');
const { Util: djsUtil, Permissions: { FLAGS } } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'tagregex',
            aliases: ['rt'],
            description: language => language.get('COMMAND_TAGREGEX_DESCRIPTION'),
            usage: '[add | remove] [Tag] [...Content]',
            permissions: 'CLIENT_OWNER',
            category: 'settings'
        })
    }

    run(msg, args) {
        if (args[0]?.toLowerCase() === 'add') return this.add(msg, args);
        this.list(msg);
    }

    async add(msg, [_, tag, ...content]) {
        if (!tag || !content.length) throw msg.language.get('COMMAND_TAGREGEX_EMPTY');
		if (await msg.guild.settings.get('regexTags').then(t => t.find(tuple => tuple.tag.toString().toLowerCase() === tag.toLowerCase()))) throw msg.language.get('COMMAND_TAGREGEX_EXISTS')
        content = content.join(' ');
		try {
			tag = new RegExp(tag);

		} catch (err) {
			throw msg.language.get('COMMAND_TAGREGEX_BADREGEX', err.message);
		}
        await msg.guild.settings.push('regexTags', {tag, content})
        return msg.responder.success('COMMAND_TAG_ADDED', tag, djsUtil.escapeMarkdown(content))
    }

    async list(msg) {
        const tags = await msg.guild.settings.get('regexTags')
        if (!tags?.length) return msg.responder.error('COMMAND_TAG_NOTAGS');
        const output = [msg.language.get('COMMAND_TAG_LIST', msg.guild.name, tags.length), '```asciidoc'];
        let index = 1;
        for (const tag of tags) {
            output.push(`${index}. ${tag.tag} :: ${tag.content.substring(0, 30)}`)
            index++;
        };
        output.push('```');
        return msg.channel.send(output.join(`\n`));
    }
}