const { MessageEmbed, Permissions: { FLAGS }, Role, Emoji, Channel, User } = require('discord.js');
const { emojis: { perms: { granted, notSpecified } }, badges } = require('../../../lib/util/constants')
const moment = require('moment')

module.exports = {
    name: 'info',
	aliases: ['i', 'user', 'whois', 'role', 'channel', 'emoji', 'emote', 'warns', 'warnings', 'notes'],
	usage: 'fox info (role|server|user|channel|emoji)',
	//category: 'utility',

    perms: {
        ADMINISTRATOR: 'Administrator',
        VIEW_AUDIT_LOG: 'View Audit Log',
        MANAGE_GUILD: 'Manage Server',
        MANAGE_ROLES: 'Manage Roles',
        MANAGE_CHANNELS: 'Manage Channels',
        KICK_MEMBERS: 'Kick Members',
        BAN_MEMBERS: 'Ban Members',
        CREATE_INSTANT_INVITE: 'Create Instant Invite',
        CHANGE_NICKNAME: 'Change Nickname',
        MANAGE_NICKNAMES: 'Manage Nicknames',
        MANAGE_EMOJIS: 'Manage Emojis',
        MANAGE_WEBHOOKS: 'Manage Webhooks',
        VIEW_CHANNEL: 'Read Text Channels and See Voice Channels',
        SEND_MESSAGES: 'Send Messages',
        SEND_TTS_MESSAGES: 'Send TTS Messages',
        MANAGE_MESSAGES: 'Manage Messages',
        EMBED_LINKS: 'Embed Links',
        ATTACH_FILES: 'Attach Files',
        READ_MESSAGE_HISTORY: 'Read Message History',
        MENTION_EVERYONE: 'Mention Everyone',
        USE_EXTERNAL_EMOJIS: 'Use External Emojis',
        ADD_REACTIONS: 'Add Reactions',
        CONNECT: 'Connect',
        SPEAK: 'Speak',
        MUTE_MEMBERS: 'Mute Members',
        DEAFEN_MEMBERS: 'Deafen Members',
        MOVE_MEMBERS: 'Move Members',
        USE_VAD: 'Use Voice Activity',
        STREAM: 'Go Live',
        ROLE: 'testing role thing'
    },

    regions: {
        'eu-central': 'Central Europe',
        india: 'India',
        london: 'London',
        japan: 'Japan',
        amsterdam: 'Amsterdam',
        brazil: 'Brazil',
        'us-west': 'US West',
        hongkong: 'Hong Kong',
        southafrica: 'South Africa',
        sydney: 'Sydney',
        europe: 'Europe',
        singapore: 'Singapore',
        'us-central': 'US Central',
        'eu-west': 'Western Europe',
        dubai: 'Dubai',
        'us-south': 'US South',
        'us-east': 'US East',
        frankfurt: 'Frankfurt',
        russia: 'Russia'
    },

    verificationLevels: {
        NONE: 'None',
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: '(╯°□°）╯︵ ┻━┻',
        VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    },

    filterLevels: {
        DISABLED: "Don't scan any messages",
        MEMBERS_WITHOUT_ROLES: 'Scan messages from members without a role',
        ALL_MEMBERS: 'Scan messages by all members'
    },

    async execute (props) {

        let { lang, message, args, language } = props;

        let user; let emoji;
        channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.client.users.cache.find(u => u.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member.user;
        let server = message.client.guilds.cache.get(args[1]) || message.guild;
		let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()); 
        if (args[0]) emoji = message.client.emojis.cache.find((emj) => emj.id === args[0].replace(/^<a?:\w+:(\d+)>$/, '$1'))

        if (channel instanceof Channel) return this.channelInfo();
        if (emoji instanceof Emoji) return this.emojiinfo(message, emoji, language, lang);
        if (role instanceof Role) return this.roleinfo(role, message, language, lang);
        if (message.guild && args[0] === 'server') return this.serverinfo(this.regions, this.verificationLevels, this.filterLevels);
		if (message.guild && args[0] === message.guild.id) this.serverinfo(this.regions, this.verificationLevels, this.filterLevels);
        if (user instanceof User && args[0] !== 'server' && user) return this.userInfo(message, user, language, lang);

    },

    async userInfo(msg, user, language, lang) {

        const loading = await language.send("MESSAGE_LOADING", lang);
        let embed = new MessageEmbed();
        embed = await this._addBaseData(embed, user);
        embed = await this._addBadges(embed, user);
        embed = await this._addMemberData(embed, msg, user, language, lang);
        await loading.delete();
        return msg.channel.send(embed);
    },

    async _addBaseData(embed, user) {
        return embed
            .setTitle(`${user.tag} (ID: ${user.id})`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    },

    async _addBadges(embed, user) {
        const bitfield = await user.settings.get('badges');
        const out = badges.filter((_, idx) => bitfield & (1 << idx));
        if (!out.length) return embed;
        return embed.setDescription(out.map(badge => `${badge.icon} ${badge.name}`).join('\n'));
    },

    async _addMemberData(embed, msg, user, language, lang) {

        const member = msg.guild ? await msg.guild.members.fetch(user).catch(() => null) : null;
		const creator = member && (member.joinedTimestamp - msg.guild.createdTimestamp) < 3000;

        const statistics = [
            language.get('COMMAND_INFO_USER_DISCORDJOIN', lang, moment(user.createdAt).format('MMMM Do YYYY'), moment([moment(user.createdAt).format('YYYY'), moment(user.createdAt).format('M') - 1, moment(user.createdAt).format('D')]).toNow(true))
        ];

        if (member) {

            let join = [msg.guild.name,
                moment(member.joinedAt).format('MMMM Do YYYY'),
                moment([moment(member.joinedAt).format('YYYY'), moment(member.joinedAt).format('M') - 1, moment(member.joinedAt).format('D')]).toNow(true)]

            statistics.push(creator ? language.get('COMMAND_INFO_USER_GUILDCREATE', lang, join) 
                : language.get('COMMAND_INFO_USER_GUILDJOIN', lang, join)
            );
            
            let msgs = await member.user.settings.get(`servers.${msg.guild.id}.messageCount`); 
            statistics.push(language.get('COMMAND_USER_MESSAGES_SENT', lang, msgs || 0));

            const birthday = null;
            let totalStar = await member.user.settings.get(`servers.${msg.guild.id}.starCount`);
            let minimum = await msg.guild.settings.get(`starboard.minimum`) || 3;
		    
            if (member) embed.addField(`:pencil: ${language.get('COMMAND_INFO_USER_STATISTICS', lang)} ${totalStar && totalStar >= minimum ? `:star: **${totalStar}**` : ''} ${birthday ? `:cake: **${birthday}**` : ''}`, statistics.join('\n'));
        };

        if (!member) embed.addField(`:pencil: ${language.get('COMMAND_INFO_USER_STATISTICS', lang)}`, statistics.join('\n'));
		if (!member) return embed.setColor(msg.guild.me.displayColor)

        const roles = member.roles.cache.sorted((a, b) => b.position - a.position);
        let spacer = false;
        const roleString = roles
            .array()
            .filter(role => role.id !== msg.guild.id)
            .reduce((acc, role, idx) => {
                if (acc.length + role.name.length < 1010) {
                    if (role.name === '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯') {
                        spacer = true;
                        return `${acc}\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n`;
                    } else {
                        const comma = (idx !== 0) && !spacer ? ', ' : '';
                        spacer = false;
                        return acc + comma + role.name;
                    }
                } else { return acc; }
            }, '')

        if (roles.size) {
            embed.addField(
                `:scroll: ${language.get('COMMAND_INFO_USER_ROLES', lang, roles.size)}`,
                roleString.length ? roleString : language.get('COMMAND_INFO_USER_NOROLES', lang)
            )
        };

        let warnings = await member.user.settings.get(`servers.${msg.guild.id}.warnings`)
		if (warnings?.length) {
			for (const { author } of warnings) await msg.client.users.fetch(author);
			embed.addField(
				`:lock: ${language.get('COMMAND_INFO_USER_WARNINGS', lang, warnings)}`,
				warnings.map((warn, idx) => `${idx + 1}. ${warn.active ? '~~' : ''}${warn.reason} - **${msg.client.users.cache.get(warn.author).tag}**${warn.active ? '~~' : ''}`)
			);
		}

        const notes = await member.user.settings.get(`servers.${msg.guild.id}.notes`)
		if (notes?.length) {
			for (const { author } of notes) await msg.client.users.fetch(author);
			embed.addField(
				`:label: ${language.get('COMMAND_INFO_USER_NOTES', lang, notes)}`,
				notes.map((note, idx) => `${idx + 1}. ${note.reason} - **${msg.client.users.cache.get(note.author).tag}**`)
			);
		}
        return embed.setColor(member.displayColor)
    },

    async emojiinfo(msg, emoji, language, lang) {

        let embed = new MessageEmbed()
            .setTitle(`${emoji.name} (ID: ${emoji.id})`)
            .setDescription(language.get('COMMAND_INFO_EMOJI_CREATED', lang, emoji.name, moment(emoji.createdTimestamp).format('MMMM Do YYYY'), moment([moment(emoji.createdTimestamp).format('YYYY'), moment(emoji.createdTimestamp).format('M') - 1, moment(emoji.createdTimestamp).format('D')]).toNow(true)))
            .setColor(msg.guild.me.displayColor)
            .setImage(emoji.url)
            .addField(`:pencil2: ${language.get('COMMAND_INFO_EMOJI_NAME_TITLE', lang)}`, emoji.name, true)
            .addField(`:projector: ${language.get('COMMAND_INFO_EMOJI_ANIMATED_TITLE', lang)}`, language.get('COMMAND_INFO_EMOJI_ANIMATED_VALUE', lang, emoji.animated), true)
            .addField(`:link: ${language.get('COMMAND_INFO_EMOJI_LINKS_TITLE', lang)}`, `${emoji.animated
                ? `[PNG](${emoji.url.replace('.gif', '.png')}) | [JPEG](${emoji.url.replace('.gif', '.jpg')}) | [GIF](${emoji.url})`
                :`[PNG](${emoji.url}) | [JPEG](${emoji.url.replace('.png', '.jpeg')})`}`, true)

        return msg.channel.send(embed)
    },

    async channelInfo() {

        const embed = new MessageEmbed()
            .setTitle(`${channel.name} (ID: ${channel.id})`)
            .setColor(message.guild.me.displayColor)
            .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
            .setDescription(`${channel.name} was created ${moment(channel.createdAt).format('MMMM Do YYYY')} **(${moment([moment(channel.createdAt).format('YYYY'), moment(channel.createdAt).format('M') - 1, moment(channel.createdAt).format('D')]).toNow(true)} ago)**`)

            channel.type === 'text'
            ? embed.addField(`**Channel Topic**`, channel.topic
            ? channel.topic : 'No channel topic is set for this channel') : ''

            embed.addField(':dividers: **Type**', channel.type, true)
                .addField(':scroll: **Category**', `${channel.parent?channel.parent.name:'None'}`, true)
                .addField('\u200B', '\u200B', true)

            channel.type === 'text' || channel.type === 'news'
            ? embed.addField(':underage: **NSFW**', channel.nsfw
            ?'Yes':'No', true) : ''

            channel.type === 'voice'
            ? embed.addField(':busts_in_silhouette: **User Limit**', channel.userLimit === 0
            ? 'Infinite' : channel.userLimit, true) : ''

            channel.type === 'text' || channel.type === 'news'
            ? embed.addField(':alarm_clock: **Chat Cooldown**', channel.rateLimitPerUser == 0 || channel.rateLimitPerUser == null
            ? 'None' : `${channel.rateLimitPerUser} Seconds`, true) : ''

            channel.type === 'voice'
            ? embed.addField(':satellite: **Bit Rate**', `${channel.bitrate/1000} KB/s`, true) : ''

            channel.type === 'text' || channel.type === 'news'
            ? embed.addField('\u200B', '\u200B', true) : ''

            channel.type === 'voice'
            ? embed.addField('\u200B', '\u200B', true) : ''

            return message.channel.send(embed)
        },

    async roleinfo(role, message, language, lang){
        const [bots, humans] = role.members.partition(member => member.user.bot);

        const embed = new MessageEmbed()
            .setTitle(`${role.name} (ID: ${role.id})`)
            .setColor(role.color)
            .addField(`:art: ${language.get('COMMAND_INFO_ROLE_COLOR', lang)}`, role.color ? role.hexColor : language.get('COMMAND_INFO_ROLE_NONE', lang), true)
            .addField(`:people_hugging: ${language.get('COMMAND_INFO_ROLE_MEMBERS_TITLE', lang)}`, language.get('COMMAND_INFO_ROLE_MEMBERS_VALUE', lang, humans.size, bots.size), true)
            .addField(`:hammer: ${language.get('COMMAND_INFO_ROLE_PERMISSIONS_TITLE', lang)}`, role.permissions.has(FLAGS.ADMINISTRATOR)
                ? language.get('COMMAND_INFO_ROLE_ALLPERMS', lang)
                : Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) => this.perms[perm]).join(', ') || language.get('COMMAND_INFO_ROLE_NONE', lang), true)
            .addField(`:calendar: ${language.get('COMMAND_INFO_ROLE_CREATED_TITLE', lang)}`, language.get('COMMAND_INFO_ROLE_CREATED_VALUE', lang, moment(role.createdAt).format('MMMM Do YYYY'), moment([moment(role.createdAt).format('YYYY'), moment(role.createdAt).format('M') - 1, moment(role.createdAt).format('D')]).toNow(true)), true)
            
            .addField(`:bookmark_tabs: ${language.get('COMMAND_INFO_ROLE_PROPERTIES_TITLE', lang)}`, language.get('COMMAND_INFO_ROLE_PROPERTIES_ARRAY', lang, role.hoist, role.mentionable, !role.managed, role.toString()));

        return message.channel.send(embed);
    },

        async serverinfo(region, veri, filter) {
            let messageCount = await server.settings.get('messageCount');
                    
            let messages = 0
            if (messageCount) messages = messageCount;
            const guild = server;
            const toxicity = 0

            await message.guild.members.fetch(message.guild.ownerID);

            const embed = new MessageEmbed()
                .setTitle(`${guild.name} (ID: ${guild.id})`)
                .setDescription(`Created by **${guild.owner.user.tag}** on ${moment(guild.createdAt).format('MMMM Do YYYY')} **(${moment([moment(guild.createdAt).format('YYYY'), moment(guild.createdAt).format('M') - 1, moment(guild.createdAt).format('D')]).toNow(true)} ago)**`)
                .addField(':crown: **Owner**', guild.owner.user.tag, true)
                .addField(':busts_in_silhouette: **Members**', `${guild.memberCount} (cached: ${guild.members.cache.size})`, true)
                .addField(`:speech_balloon: **Channels (${guild.channels.cache.size})**`, guild.channels.cache.size>0?`Text: **${guild.channels.cache.filter(c => c.type === "text").size}**\nVoice: **${guild.channels.cache.filter(c => c.type === "voice").size}**`:'None', true)
                .addField(':map: **Region**', region[guild.region], true)
                .addField(`:scroll: **Roles**`, guild.roles.cache.size > 0 ? guild.roles.cache.size : 'None', true)
                .addField(':sunglasses: **Emojis**', guild.emojis.cache.size > 0 ? guild.emojis.cache.size : 'None', true)
                .addField(':bar_chart: **Statistics**', `${messages.toLocaleString()} messages ${toxicity !== 0 ? `with an average toxicity of ${Math.round(toxicity * 100)}%` : ''} sent`)
                .addField(':lock: **Security**', [
                    `Verification level: ${veri[message.guild.verificationLevel]}`,
                    `Explicit filter: ${filter[message.guild.explicitContentFilter]}`
                ].join('\n'));

            embed.setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
            embed.setColor(message.guild.me.displayColor)
            return message.channel.send(embed);
        }
    
}