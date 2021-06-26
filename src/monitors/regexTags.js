const { Monitor } = require('@foxxie/tails');
const Parser = require('@aero/tags');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreOthers: false,
            ignoreEdits: false,
        })

        this.parser = new Parser();
    }

    async run(msg) {
        if (!msg.guild) return;
        const tags = await msg.guild.settings.get('regexTags');

        if (!tags?.length) return;

        const matchedTags = tags.filter(t => t.tag.test(msg.content));

        for (const tag of matchedTags) {
            const parsedTag = await this.parser.parse(tag.content, {
                args: msg.content.slice(msg.prefix.length).trim().split(/\s+/).slice(1),
				user: msg.author,
				guild: msg.guild,
				channel: msg.channel,
				member: msg.member,
				trigger: msg,
            }).then(result => result?.trim());

            if (!parsedTag.length) continue;
            msg.channel.send(parsedTag)
        }

        return;
    }
}