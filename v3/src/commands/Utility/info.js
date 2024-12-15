const { MessageEmbed, Permissions: { FLAGS }, Role, GuildMember, Emoji, Channel, User } = require('discord.js');
const { badges, color: { BAD, VERY_BAD, SUPER_BAD } } = require('~/lib/util/constants');
const { Command, util } = require('@foxxie/tails');
const { Timestamp, zws, Duration } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'info',
            aliases: ['i', 'user', 'whois', 'role', 'channel', 'emoji', 'emote', 'warns', 'warnings', 'notes'],
            description: language => language.get('COMMAND_INFO_DESCRIPTION'),
			requiredPermissions: ['EMBED_LINKS'],
            usage: '(User | Role | Channel | Emoji | server)',
            category: 'utility'
        })

        this.timestamp = new Timestamp('MMMM d YYYY');

        this.perms = {
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
			STREAM: 'Go Live'
		};

        this.regions = {
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
		};

		this.verificationLevels = {
			NONE: 'None',
			LOW: 'Low',
			MEDIUM: 'Medium',
			HIGH: '(╯°□°）╯︵ ┻━┻',
			VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		};

        this.filterLevels = {
			DISABLED: "Don't scan any messages",
			MEMBERS_WITHOUT_ROLES: 'Scan messages from members without a role',
			ALL_MEMBERS: 'Scan messages by all members'
		};
    }

    async run(msg, args) {

		let arg, server = this.client.guilds.cache.get(args[1]);
		const emoji = this.client.emojis.cache.get(msg.emojis.length ? msg.emojis?.shift().replace(/\D/g, '') : null);
		arg = msg.users?.shift();
		if (!arg) arg = await this.client.users.fetch(args[0]).catch(() => null);
		if (!arg) arg = msg.channels?.shift();
		if (!arg && emoji) arg = emoji;
		if (!arg) arg = msg.roles?.shift();
		if (!arg && !args[0]) arg = msg.author;
		if (args[0] === 'server') arg = 'server';

        if (arg instanceof User) return this.userInfo(msg, arg);
        if (arg instanceof GuildMember) return this.userInfo(msg, arg.user);
        if (arg instanceof Role) return this.roleInfo(msg, arg);
		if (arg instanceof Channel) return this.channelInfo(msg, arg);
		if (arg instanceof Emoji) return this.emojiInfo(msg, arg);
        if (msg.guild && arg === 'server') return this.serverInfo(msg, server);
		
		msg.responder.error('COMMAND_INFO');
		return false;
    }

	async userInfo(msg, user) {
		const loading = await msg.responder.loading();
		let embed = new MessageEmbed().setColor(msg.guild.me.displayColor);
		embed = await this.addBaseData(user, embed);
		embed = await this.addBadges(user, embed);
		embed = await this.addMemberData(msg, user, embed);
		embed = await this.addBans(msg, user, embed);
		await msg.channel.send(embed);
		return loading.delete();
	}

	async addBaseData(user, embed) {
		return embed
			.setTitle(`${user.tag} (ID: ${user.id})`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
	}

	async addBadges(user, embed) {
		const bitfield = await user.settings.get('badges');
        const out = badges.filter((_, idx) => bitfield & (1 << idx));
        if (!out.length) return embed;

        return embed.setDescription(out.map(badge => `${badge.icon} ${badge.name}`).join('\n'));
	}

	async addMemberData(msg, user, embed) {
		const member = msg.guild ? await msg.guild.members.fetch(user).catch(() => null) : null;
		const creator = member && (member.joinedTimestamp - msg.guild.createdTimestamp) < 3000;

		const statistics = [
			msg.language.get('COMMAND_INFO_USER_DISCORDJOIN', this.timestamp.display(user.createdAt), Duration.toNow(user.createdAt))
		];

		if (member) {
			const serverMsgs = await member.guild.settings.get('messageCount');
			const memberMsgs = await member.user.settings.get(`servers.${msg.guild.id}.messageCount`) || 0;
			statistics.push(msg.language.get(
					creator ? 'COMMAND_INFO_USER_GUILDCREATE' : 'COMMAND_INFO_USER_GUILDJOIN',
					msg.guild.name,
					this.timestamp.display(member.joinedAt),
					Duration.toNow(member.joinedAt)));
			statistics.push(msg.language.get('COMMAND_INFO_USER_MESSAGES', memberMsgs, ((memberMsgs/serverMsgs)*100).toFixed(0)));
		}

		const stars = await user.settings.get(`servers.${msg.guild.id}.starCount`);
		embed.addField(msg.language.get('COMMAND_INFO_USER_STATISTICS', stars), statistics.join('\n'));
		if (!member) return embed;

		const roles = member.roles.cache.sort((a, b) => b.position - a.position);
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
			}, '');

		if (roles.size) {
			embed.addField(
				msg.language.get('COMMAND_INFO_USER_ROLES', roles.size > 2 ? `s (${roles.size - 1})` : roles.size === 2 ? '' : 's'),
				roleString.length ? roleString : msg.language.get('COMMAND_INFO_USER_NOROLES')
			);
		}

		const warnings = await member.user.settings.get(`servers.${msg.guild.id}.warnings`);
		if (warnings?.length) {
			for (const { author } of warnings) await this.client.users.fetch(author);
			embed.addField(
				msg.language.get('COMMAND_INFO_USER_WARNINGS', warnings.length),
				warnings.map((warn, idx) => `${idx + 1}. ${warn.active ? '~~' : ''}${warn.reason} - **${this.client.users.cache.get(warn.author).tag}**${warn.active ? '~~' : ''}`)
			)
		}
		const notes = await member.user.settings.get(`servers.${msg.guild.id}.notes`);
		if (notes?.length) {
			for (const { author } of notes) await this.client.users.fetch(author);
			embed.addField(
				msg.language.get('COMMAND_INFO_USER_NOTES', notes.length),
				notes.map((note, idx) => `${idx + 1}. ${note.reason} - **${this.client.users.cache.get(note.author).tag}**`)
			);
		}

		return embed.setColor(member.displayColor);
	}

	async addBans(msg, user, embed) {
		const bans = await user.settings.get('globalBans')
		if (!bans?.length) return embed;
		return embed
		.setColor(bans.length === 1 ? BAD : bans.length === 2 ? VERY_BAD : SUPER_BAD)
		.addField(
			msg.language.get('COMMAND_INFO_USER_GLOBALBANS', bans.length),
			bans.map((b, idx) => `${idx + 1}. **${this.client.guilds.cache.get(b.guild).name} (ID: ${b.guild})**:\n${b.reason}`).join('\n'))
	}

	async serverInfo(msg, server) {
		if (!server) server = msg.guild;
		const messages = await server.settings.get('messageCount') || 0;
		await server.members.fetch(server.ownerID);
		const guild = server;

		const embed = new MessageEmbed()
			.setColor(msg.guild.me.displayColor)
			.setTitle(`${guild.name} (ID: ${guild.id})`)
			.setThumbnail(guild.iconURL({ format: 'png', dynamic: true}))
			.setDescription(msg.language.get('COMMAND_INFO_SERVER_CREATED', guild.owner.user.tag, this.timestamp.display(guild.createdAt), Duration.toNow(guild.createdAt)))
			.addField(msg.language.get('COMMAND_INFO_SERVER_OWNER'), guild.owner.user.tag, true)
			.addField(msg.language.get('COMMAND_INFO_SERVER_MEMBERS'), msg.language.get('COMMAND_INFO_SERVER_MEMBERCOUNT', guild.memberCount, guild.members.cache.size), true)
			.addField(msg.language.get('COMMAND_INFO_SERVER_CHANNELS', guild.channels.cache.filter(c => c.type !== 'category').size), msg.language.get('COMMAND_INFO_SERVER_CHANNELSSIZE', guild.channels.cache.filter(c => c.type !== 'category').size > 0, guild.channels.cache.filter(c => c.type === "text").size, guild.channels.cache.filter(c => c.type === "voice").size), true)
			.addField(msg.language.get('COMMAND_INFO_SERVER_REGION'), this.regions[guild.region], true)
			.addField(msg.language.get('COMMAND_INFO_SERVER_ROLES'), msg.language.get('COMMAND_INFO_SERVER_ROLESSIZE', guild.roles.cache.size - 1 > 0, guild.roles.cache.size - 1), true)
			.addField(msg.language.get('COMMAND_INFO_SERVER_EMOJIS', guild.emojis.cache.size), msg.language.get('COMMAND_INFO_SERVER_EMOJISSIZE', guild.emojis.cache.size > 0, guild.emojis.cache.filter(e => !e.animated).size, guild.emojis.cache.filter(e => e.animated).size), true)
			.addField(msg.language.get('COMMAND_INFO_SERVER_STATISTICS'), msg.language.get('COMMAND_INFO_SERVER_MESSAGES', messages.toLocaleString()))
			.addField(msg.language.get('COMMAND_INFO_SERVER_SECURITY'), msg.language.get('COMMAND_INFO_SERVER_SECURITYARRAY', this.verificationLevels[guild.verificationLevel], this.filterLevels[guild.explicitContentFilter]))

		return msg.channel.send(embed);
	}

	async channelInfo(msg, channel) {

		let embed = new MessageEmbed()
			.setColor(msg.guild.me.displayColor)
			.setTitle(`${channel.name} (ID: ${channel.id})`)
			.setThumbnail(msg.guild.iconURL({ format: 'png', dynamic: true}))
			.setDescription(msg.language.get('COMMAND_INFO_CHANNEL_CREATED', channel.name, this.timestamp.display(channel.createdAt), Duration.toNow(channel.createdAt)))

		if (channel.type === 'voice') embed = await this._voiceChannel(msg, channel, embed);
		else embed = await this._textChannel(msg, channel, embed);
		msg.channel.send(embed);
	}

	_voiceChannel(msg, channel, embed) {

		return embed
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_TYPE'), util.toTitleCase(channel.type), true)
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_CATEGORY'), msg.language.get('COMMAND_INFO_CHANNEL_CATEGORYTYPE', channel.parent, channel.parent?.name), true)
			.addField('\u200B', '\u200B', true)
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_USERLIMIT'), msg.language.get('COMMAND_INFO_CHANNEL_USERLIMITNUMBER', channel.userLimit === 0, channel.userLimit), true)
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_BITRATE'), `${channel.bitrate / 1000}KB/s`, true)
			.addField('\u200B', '\u200B', true)
	}

	_textChannel(msg, channel, embed) {

		return embed
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_TOPIC'), msg.language.get('COMMAND_INFO_CHANNEL_CATEGORYTYPE', channel.topic, channel.topic))
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_TYPE'), util.toTitleCase(channel.type), true)
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_CATEGORY'), msg.language.get('COMMAND_INFO_CHANNEL_CATEGORYTYPE', channel.parent, channel.parent?.name), true)
			.addField(zws, zws, true)
			.addField(':underage: **NSFW**', msg.language.get('COMMAND_INFO_CHANNEL_ISNSFW', channel.nsfw), true)
			.addField(msg.language.get('COMMAND_INFO_CHANNEL_COOLDOWN'), msg.language.get('COMMAND_INFO_CHANNEL_SLOWMODE', !channel.rateLimitPerUser || channel.rateLimitPerUser === 0, channel.rateLimitPerUser), true)
			.addField(zws, zws, true)
	}

	emojiInfo(msg, emoji) {

		const linkArray = [`[PNG](${emoji.url.substring(0, emoji.url.length - 4)}.png)`, `[JPEG](${emoji.url.substring(0, emoji.url.length - 4)}.jpeg)`]
		if (emoji.animated) linkArray.push(`[GIF](${emoji.url})`)

		const embed = new MessageEmbed()
			.setThumbnail(emoji.url)
			.setColor(msg.guild.me.displayColor)
			.setTitle(`${emoji.name} (ID: ${emoji.id})`)
			.setDescription(msg.language.get('COMMAND_INFO_EMOJI_CREATED', emoji.name, this.timestamp.display(emoji.createdAt), Duration.toNow(emoji.createdAt)))
			.addField(msg.language.get('COMMAND_INFO_EMOJI_NAME'), emoji.name, true)
			.addField(msg.language.get('COMMAND_INFO_EMOJI_ANIMATED'), msg.language.get('COMMAND_INFO_EMOJI_ANIMATEDVALUE', emoji.animated), true)
			.addField(msg.language.get('COMMAND_INFO_EMOJI_LINKS'), linkArray.join(' | '), true)

		return msg.channel.send(embed);
	}

	roleInfo(msg, role) {
		
		const [bots, humans] = role.members.partition(member => member.user.bot);

		const embed = new MessageEmbed()
			.setColor(role.color)
			.setTitle(`${role.name} (ID: ${role.id})`)
			.addField(msg.language.get('COMMAND_INFO_ROLE_COLOR'), msg.language.get('COMMAND_INFO_ROLE_COLORHEX', role.color, role.hexColor), true)
			.addField(msg.language.get('COMMAND_INFO_ROLE_MEMBERS', role.members.size > 0, role.members.size), msg.language.get('COMMAND_INFO_ROLE_PARTITION', role.members.size > 0, humans.size, bots.size), true)
			.addField(msg.language.get('COMMAND_INFO_ROLE_PERMISSIONS'), msg.language.get('COMMAND_INFO_ROLE_PERMISSIONSMAP', role.permissions.has(FLAGS.ADMINISTRATOR), Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) => this.perms[perm]).join(', ')), true)
			.addField(msg.language.get('COMMAND_INFO_ROLE_CREATED'), msg.language.get('COMMAND_INFO_ROLE_CREATEDDATE', this.timestamp.display(role.createdAt), Duration.toNow(role.createdAt)), true)
			.addField(msg.language.get('COMMAND_INFO_ROLE_PROPERTIES'), msg.language.get('COMMAND_INFO_ROLE_PROPERTIESARRAY', role.hoist, role.mentionable, !role.managed, role.toString()))

		return msg.channel.send(embed);
	}
}