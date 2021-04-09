const { MessageEmbed, Permissions: { FLAGS } } = require('discord.js');
const { emojis: { perms: { granted, notSpecified } } } = require('../../../lib/util/constants')
const mongo = require('../../../lib/structures/database/mongo')
const warnSchema = require('../../../lib/structures/database/schemas/warnSchema')
const noteSchema = require('../../../lib/structures/database/schemas/noteSchema')
const db = require('quick.db')
const moment = require('moment')
module.exports = {
    name: 'info',
	aliases: ['i', 'user', 'whois', 'role', 'channel', 'emoji', 'emote', 'warns', 'warnings', 'notes'],
	usage: 'fox info (role/server/user/channel/emoji)',
	guildOnly: true,
    execute: async (lang, message, args, client) => {
        let user;
        channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find(u => u.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member.user;
        let server = client.guilds.cache.get(args[1]) || message.guild;
		let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()); 

		this.perms = lang.PERMISSIONS

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


        if (args[0]) {


            const regex = args[0].replace(/^<a?:\w+:(\d+)>$/, '$1');
            const emoji = message.client.emojis.cache.find((emj) => emj.name === args[0] || emj.id === regex)

            if (emoji) {
                let embed = new MessageEmbed()
                    .setTitle(`${emoji.name} (ID: ${emoji.id})`)
                    .setDescription(`The **${emoji.name}** emote was created ${moment(emoji.createdTimestamp).format('MMMM Do YYYY')} **(${moment([moment(emoji.createdTimestamp).format('YYYY'), moment(emoji.createdTimestamp).format('M') - 1, moment(emoji.createdTimestamp).format('D')]).toNow(true)} ${lang.COMMAND_ROLE_CREATED_AGO})**`)
                    .setColor(message.guild.me.displayColor)
                    .setImage(emoji.url)
                    .addField(`:pencil2: **Name**`, emoji.name, true)
                    .addField(`:projector: **Animated**`, `${emoji.animated?'Yes':'No'}`, true)
                    .addField(':link: **Image Links**', `${emoji.animated
                        ? `[PNG](${emoji.url.replace('.gif', '.png')}) | [JPEG](${emoji.url.replace('.gif', '.jpg')}) | [GIF](${emoji.url})`
                        :`[PNG](${emoji.url}) | [JPEG](${emoji.url.replace('.png', '.jpeg')})`}`, true)

                return message.channel.send(embed)
            }
        }


        if (channel) {

            const embed = new MessageEmbed()
                .setTitle(channel.name)
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
        }


        if (role) { 
            const [bots, humans] = role.members.partition(member => member.user.bot);

            const embed = new MessageEmbed()
                .setTitle(`${role.name} (ID: ${role.id})`)
                .setColor(role.color)
                .addField(`:art: ${lang.COMMAND_ROLE_COLOR}`, role.color ? role.hexColor : lang.COMMAND_ROLE_NOCOLOR, true)
                .addField(`:people_hugging: ${lang.COMMAND_ROLE_MEMBERS}`, `${humans.size} ${lang.COMMAND_ROLE_USER}${humans.size === 1 ? '' : lang.COMMAND_ROLE_PLURAL}, ${bots.size} ${lang.COMMAND_ROLE_BOTS}${bots.size === 1 ? '' : lang.COMMAND_ROLE_PLURAL}`, true)
                .addField(`:hammer: ${lang.COMMAND_ROLE_PERMISSIONS}`, role.permissions.has(FLAGS.ADMINISTRATOR)
                    ? lang.COMMAND_ROLE_ALLPERMS
                    : Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) => this.perms[perm]).join(', ') || lang.COMMAND_ROLE_NOCOLOR, true)
                .addField(`:calendar: ${lang.COMMAND_ROLE_CREATED}`, `${moment(role.createdAt).format('MMMM Do YYYY')} **(${moment([moment(role.createdAt).format('YYYY'), moment(role.createdAt).format('M') - 1, moment(role.createdAt).format('D')]).toNow(true)} ${lang.COMMAND_ROLE_CREATED_AGO})**`, true)
                .addField(`:bookmark_tabs: ${lang.COMMAND_ROLE_PROPERTIES}`, [
                    role.hoist
                        ? `${granted} ${lang.COMMAND_ROLE_SEPERATE}`
                        : `${notSpecified} ${lang.COMMAND_ROLE_NOTSEPERATE}`,
                    role.mentionable
                        ? `${granted} ${lang.COMMAND_ROLE_MENTIONABLE} ${role.toString()}`
                        : `${notSpecified} ${lang.COMMAND_ROLE_NOT_MENTIONABLE}`,
                    !role.managed
                        ? `${granted} ${lang.COMMAND_ROLE_CONFIGURABLE}`
                        : `${notSpecified} ${lang.COMMAND_ROLE_INTEGRATION}`
                ].join('\n'));

            return message.channel.send(embed);    }

        if (server && args[0] === 'server') {
        
            const guild = server; //guild.createdAt
            let messages = db.get(`Guilds.${guild.id}.Stats.Messages`) || '0'
            const toxicity = 0

            await message.guild.members.fetch(message.guild.ownerID);

            const embed = new MessageEmbed()
                .setTitle(`${guild.name} (ID: ${guild.id})`)
                .setDescription(`Created by **${guild.owner.user.tag}** on ${moment(guild.createdAt).format('MMMM Do YYYY')} **(${moment([moment(guild.createdAt).format('YYYY'), moment(guild.createdAt).format('M') - 1, moment(guild.createdAt).format('D')]).toNow(true)} ago)**`)
                .addField(':crown: **Owner**', guild.owner.user.tag, true)
                .addField(':busts_in_silhouette: **Members**', `${guild.memberCount} (cached: ${guild.members.cache.size})`, true)
                .addField(`:speech_balloon: **Channels (${guild.channels.cache.size})**`, guild.channels.cache.size>0?`Text: **${guild.channels.cache.filter(c => c.type === "text").size}**\nVoice: **${guild.channels.cache.filter(c => c.type === "voice").size}**`:'None', true)
                .addField(':map: **Region**', this.regions[guild.region], true)
                .addField(`:scroll: **Roles**`, guild.roles.cache.size > 0 ? guild.roles.cache.size : 'None', true)
                .addField(':sunglasses: **Emojis**', guild.emojis.cache.size > 0 ? guild.emojis.cache.size : 'None', true)
                .addField(':bar_chart: **Statistics**', `${messages.toLocaleString()} messages ${toxicity !== 0 ? `with an average toxicity of ${Math.round(toxicity * 100)}%` : ''} sent`)
                .addField(':lock: **Security**', [
                    `Verification level: ${this.verificationLevels[message.guild.verificationLevel]}`,
                    `Explicit filter: ${this.filterLevels[message.guild.explicitContentFilter]}`
                ].join('\n'));

            embed.setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
            embed.setColor(message.guild.me.displayColor)

            return message.channel.send(embed);
        }

        if (user) {
        
            const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);

            let embed = new MessageEmbed();
            
                embed
                    .setTitle(`${user.tag} (ID: ${user.id})`)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }));

                    user.id === '754598258742919178' ? embed
                                                        .setDescription(`• Certified Cutie`)
                                                   : '';
            
                    const member = message.guild ? await message.guild.members.fetch(user).catch(() => null) : null;
            
                    const statistics = [
                        `Joined Discord on ${moment(user.createdAt).format('MMMM Do YYYY')} **(${moment([moment(user.createdAt).format('YYYY'), moment(user.createdAt).format('M') - 1, moment(user.createdAt).format('D')]).toNow(true)} ago)**` //Duration.toNow(user.createdAt)
                    ];
            
                    if (member) {
                        let stats_messages = db.get(`Guilds.${message.guild.id}.Users.${member.user.id}.Stats.Messages`) || '0'
                        statistics.push((
                            `${member.user.id == message.guild.ownerID ? 'Created' : 'Joined'} ${message.guild.name} ${moment(member.joinedAt).format('MMMM Do YYYY')} **(${moment([moment(member.joinedAt).format('YYYY'), moment(member.joinedAt).format('M') - 1, moment(member.joinedAt).format('D')]).toNow(true)} ago)**`
                        ))
                        
                        statistics.push(`${stats_messages.toLocaleString()} messages sent`);
            
                        embed.addField(`:pencil: **Statistics**`, statistics.join('\n'));
                        if (!member) return embed;
                
                        const roles = member.roles.cache.sort((a, b) => b.position - a.position);
                        let spacer = false;
                        const roleString = roles
                            .array()
                            .filter(role => role.id !== message.guild.id)
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
                                `:scroll: **Role${roles.size > 2 ? `s (${roles.size - 1})` : roles.size === 2 ? '' : 's'}**`,
                                roleString.length ? roleString : 'No roles'
                            );
                        }

                        guildId = message.guild.id
                        userId = member.user.id

                        await mongo().then(async mongoose => {
                            try {
                                const results = await warnSchema.findOne({
                                    guildId,
                                    userId
                                })
                                results?this.warnings = results.warnings : this.warnings = [];
                                if (this.warnings.length) {
                                    embed.addField(
                                        `:lock: **Warnings (${this.warnings.length})**`,
                                        this.warnings.map((warn, idx) => `${idx + 1}. ${warn.reason} - **${client.users.cache.get(warn.author).tag}**`)
                                    );
                                }
                            } finally {}
                            try {
                                const results2 = await noteSchema.findOne({
                                    guildId,
                                    userId
                                })
                                results2?notes = results2.notes : notes = [];
                                if (notes.length) {
                                    embed.addField(
                                        `:label: **Notes (${notes.length})**`,
                                        notes.map((note, idx) => `${idx + 1}. ${note.reason} - **${client.users.cache.get(note.author).tag}**`)
                                    );
                                }
                            }
                            finally {
                                mongoose.connection.close()
                            }
                        })

                        embed.setColor(member.displayColor)
                    }

                    if (!member) embed.addField(`:pencil: **Statistics**`, statistics.join('\n'));
                    if (!member) embed.setColor(message.guild.me.displayColor)

            loading.delete();
            await message.channel.send(embed);
    
        }
    }
}