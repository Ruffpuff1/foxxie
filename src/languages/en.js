const { GUILDS, USERS } = require('../index')
const moment = require('moment')
const { credits: { developer, spanishTranslation, additionalHelp }, emojis: { infinity } } = require('../../lib/util/constants')
const { botVer, numOfAliases, numOfCommands, botInv, supportServer, serverLink } = require('../../lib/config')
module.exports = {

    COMMAND_ABOUT_COMMANDS: "**Commands**",
    COMMAND_ABOUT_COMMANDS_NOW: `**•** Right now I have **${numOfCommands}** commands and **${numOfAliases}** aliases.`,
    COMMAND_ABOUT_CREATED: "**Created**",
    COMMAND_ABOUT_CREDITS: "**Credits**",
    COMMAND_ABOUT_CREDITS_LIST: `**•** Developer: ${developer}
**•** Spanish Translations: ${spanishTranslation}
**•** Additional Help: ${additionalHelp}`,
    COMMAND_ABOUT_CURRENTVER: `**•** Currently I'm in version **${botVer}**, pretty much always getting worked on though ;)`,
    COMMAND_ABOUT_GUILDS: "**Guilds**",
    COMMAND_ABOUT_GUILDS_SIZE: `**•** I'm looking after **${GUILDS}** servers.`,
    COMMAND_ABOUT_LINKS: "**Extra links and information**",
    COMMAND_ABOUT_LINKS_LINKS: `[[Invite Foxxie](${botInv})] | [[Support Server](${supportServer})] | [[The Corner Store](${serverLink})] | [[Patreon](https://www.patreon.com/Thecornerstore)]`,
    COMMAND_ABOUT_SUMMARY: "I started as a developmental project by **Ruffpuff#0017** to learn basic node.js and javascript. Then I was added to his server **The Corner Store** as a way to overall reduce the amount of bots. Now I'm hoping to be added to many guilds and maybe I could be helpful to ya.",
    COMMAND_ABOUT_TITLE: "About Foxxie!",
    COMMAND_ABOUT_USERS: "**Users**",
    COMMAND_ABOUT_USERS_SIZE: `**•** Right now I'm cleaning up after **${USERS}** users.`,
    COMMAND_ABOUT_VERSION: "Version",
    COMMAND_ABOUT_WASCREATED: `**•** I was created on Mon, Feb 15th 2021. **(${moment([moment('2021-02-15').format('YYYY'), moment('2021-02-15').format('M') - 1, moment('2021-02-15').format('D')]).toNow(true)} ago.)**`,
    COMMAND_AFK_HAS_SET: `has set an AFK`,
    COMMAND_AFK_ISSET: "is set as AFK",
    COMMAND_AFK_REASON: '**Reason:**',
    COMMAND_AFK_WELCOMEBACK: "Hey welcome back, I'll remove that afk for you.",
    COMMAND_AVATAR_FOXXIEAV: "**Here is my cool avatar, this is one currently a placeholder though.**",
    COMMAND_COLOR_NOCOLOR: "**Hey,** you gotta tell me which color you want me to show. I can getcha hex, rgb, hsv, hsl...",
    COMMAND_COLOR_PREVIEW: "Preview of the color",
    COMMAND_CORONA_ABSOLUTEINFECTION: "absolute infection rate",
    COMMAND_CORONA_ABSOLUTEFATAL: "absolute fatality rate",
    COMMAND_CORONA_CASES: "**Cases**",
    COMMAND_CORONA_CASEFATAL: "case fatality rate",
    COMMAND_CORONA_CASERECOVERY: "case recovery rate",
    COMMAND_CORONA_CRITICAL: "critical",
    COMMAND_CORONA_DEATHS: "**Deaths**",
    COMMAND_CORONA_FOOTER: "Gotta tell ya that these stats may not necessarily comprehensive, complete, or up to date.\nDon't go tryna use this as medical advise or anything.",
    COMMAND_CORONA_NOARGS: "**Heya,** you gotta either tell me the country you want statistics for or `global` for the whole world.",
    COMMAND_CORONA_NOSTATS: "**Heya,** that's either an invalid country or it doesn't have any statistics.",
    COMMAND_CORONA_POPTESTED: "of population tested",
    COMMAND_CORONA_RECOVERIES: "**Recoveries**",
    COMMAND_CORONA_STATS: "COVID-19 stats",
    COMMAND_CORONA_TEST: "**Tests**",
    COMMAND_CORONA_TODAY: "today",
    COMMAND_DEFINE_NO_DATA: "I **couldn't** find any data for that word, sorry.",
    COMMAND_DEFINE_NO_WORD: "**Well,** how do you expect me to define a word if you don't give me one.",
    COMMAND_EVAL_OUTPUT: "**Output**:",
    COMMAND_EVAL_OVER: "Characters over 2000!",
    COMMAND_EVAL_TOKEN: "Token Detected",
    COMMAND_EVAL_TYPE: "**Type**:",
    COMMAND_EVAL_UNDEFINED: "Undefined",
    COMMAND_HELP_DESCRIPTION: `Here is a list of all my commands.
For details on each command use \`fox help [command]\`.
If you need more help join my [server.](${supportServer})`,
    COMMAND_HELP_DMERROR: `**Whoops,** I tried to DM you but I could't, please make sure your dms are open to everyone so I can send you a message in DMs.`,
    COMMAND_HELP_FALSE: "false",
    COMMAND_HELP_FUN: "**Fun**",
    COMMAND_HELP_MODERATION: "**Moderation**",
    COMMAND_HELP_NOTVALID: "That's not a valid command!",
    COMMAND_HELP_ROLEPLAY: "**Roleplay**",
    COMMAND_HELP_SETTINGS: "**Settings**",
    COMMAND_HELP_TITLE: "Foxxie's Commands!",
    COMMAND_HELP_TRUE: "true",
    COMMAND_HELP_USAGE: "• Usage (Server only:",
    COMMAND_HELP_UTILITY: "**Utility**",
    COMMAND_INVITE_HERE: "Hey hey, here's the link to invite me.",
    COMMAND_INVITE_BODY: `[Click here!](${botInv})
Hope I can fix things up for ya.`,
    COMMAND_LANGUAGE_ENGLISH: "**Gotcha,** set this server's language to \`English/En\`.",
    COMMAND_LANGUAGE_NOARGS: "**Uhhh,** I can't change the language if you don't tell me what you want me to change it to. Try again with \`fox language [language]\`.",
    COMMAND_LANGUAGE_NOTVALIDLANG: `**Uhhh,** that language doesn't appear in my list of supported languages. You should try one of the following:
\`English/En\`
\`Spanish/Es\`
\`None\``,
    COMMAND_LANGUAGE_RESET: "**Gotcha,** reset this server's language to my default \`English/En\`.",
    COMMAND_LANGUAGE_SPANISH: "**Gotcha,** set this server's language to \`Spanish/Es\`.",
    COMMAND_MESSAGE_LOADING: `${infinity} **Taking your order,** this may take a few seconds.`,
    COMMAND_NSFW_ERROR: "**Heh,** due to the possible *risqué* nature of that command, it can only be used in channels marked as NSFW ;)",
    COMMAND_PING: "Ping?",
    COMMAND_PING_DISCORD: "Discord Latency",
    COMMAND_PING_FOOTER: "Ping may be high due to Discord breaking, not my problem.",
    COMMAND_PING_NETWORK: "Network Latency",
    COMMAND_POLL_EMBED_FOOTER: "React to one of the emotes below to vote", // needs spanish
    COMMAND_POLL_POLL_BY: "Poll by", // needs spanish
    COMMAND_POLL_TOO_FEW_OPTIONS: "**Sorry,** you need to have at least two options for the poll. Remember to separate them with a comma `,`", // needs spanish
    COMMAND_POLL_TOO_MANY_OPTIONS: "**Sorry,** I can only create polls with up to **ten options**.", // needs spanish
    COMMAND_REMINDME_AGOFOR: "ago for:",
    COMMAND_REMINDME_CONFIRMED: "**Alright,** I'll send that reminder your way in",
    COMMAND_REMINDME_FOR: "Reminder For",
    COMMAND_REMINDER_HERE: "Hey there, here's that reminder you scheduled",
    COMMAND_REMINDME_NOREASON: "You need to provide a reason for the reminder, try again.",
    COMMAND_REMINDME_NOTIME: "You need to specify a proper time for me to remind you, format it like [1s/1m/1h/1d] thx.",
    COMMAND_ROLE_ALLPERMS: "Administrator (all permissions)",
    COMMAND_ROLE_BOTS: "bot",
    COMMAND_ROLE_COLOR: "**Color**",
    COMMAND_ROLE_CONFIGURABLE: "configurable",
    COMMAND_ROLE_CREATED: "**Created**",
    COMMAND_ROLE_CREATED_AGO: "ago",
    COMMAND_ROLE_INTEGRATION: "managed by an integration",
    COMMAND_ROLE_MEMBERS: "**Members**",
    COMMAND_ROLE_MENTIONABLE: "mentionable as",
    COMMAND_ROLE_NOCOLOR: "none",
    COMMAND_ROLE_NOT_MENTIONABLE: "not mentionable",
    COMMAND_ROLE_NOTSEPERATE: "not displayed seperately",
    COMMAND_ROLE_PERMISSIONS: "**Permissions**",
    COMMAND_ROLE_PLURAL: "s",
    COMMAND_ROLE_PROPERTIES: "**Properties**",
    COMMAND_ROLE_SEPERATE: "displayed seperately",
    COMMAND_ROLE_USER: "user",
    COMMAND_SERVERLIST: "Servers using Foxxie",
    COMMAND_SERVERLIST_MEMBERCOUNT: "members",
    COMMAND_SERVERLIST_TOTALSERVERS: "total servers",
    COMMAND_SERVERLIST_PAGE: "Page",
    COMMAND_SETCOLOR_INVALIDCOLOR: "This isn't a **valid color** that I can set roles to, sorry!", // needs spanish
    COMMAND_SETCOLOR_NOPERMS: "**Sorry,** I don't have the permissions to set the color of this role. Try moving my role **above** the roles you want to set the color of.", // needs spanish
    COMMAND_SETCOLOR_NO_ROLE: "You need to provide **a role** for me to set the color", // needs spanish
    COMMAND_STEAL_MAX_EMOJI: "**Sorry,** this server already has the maxium amount of emojis it can have.", // needs spanish
    COMMAND_STEAL_NO_ARGS: "I can't steal **an emoji** if you don't provide one.", // needs spanish
    COMMAND_STEAL_STOLE: "Stole", // needs spanish
    COMMAND_SUPPORT_HERE: "Hey hey, here's the link to my support server.",
    COMMAND_SUPPORT_BODY: `[Click here!](${supportServer})
Hope we can help you out abit.`,
    TESTING: "Test from",
    COMMAND_UPTIME: `Hello! Foxxie **v${botVer}** has been last rebooted`,
    COMMAND_UPTIME_DAYS: 'days,',
    COMMAND_UPTIME_HOURS: 'hours,',
    COMMAND_UPTIME_MINUTES: 'minutes, and',
    COMMAND_UPTIME_SECONDS: 'seconds ago.',
    COMMAND_URBAN_NO_DATA: "**Yikes,** sorry I couldn't find any data for that word.",
    COMMAND_URBAN_NO_WORD: "**Okay,** how do you expect me to define a word if you don't provide one?",
    COMMAND_WOLFRAM_NO_ARGS: "Heya, a **search term** is required for this command.", // needs spanish
    COMMAND_WOLFRAM_NO_DATA: "**Sorry,** I couldn't find any data for that search term.", // needs spanish

    COMMAND_DESCRIPTIONS : {

        EVAL: "Allows ya to evaluate JavaScript code straight from Discord.",
        RELOAD: "Reloads a command automatically so you don't have to restart the bot.", // needs spanish
        SERVERLIST: "Provides the list of all the servers im in.",

        CAT: "Gets a random image of a cat using api.thecatapi.com.",
        DOG: "Shows a random image of a dog from dog.co/api.",
        FOX: "Shows a random image of a fox from randomfox.ca/floof.",
        POKEMON: "Shows stats and an image of a given pokemon.",
        TOPIC: "Sends a random conversation starter from https://www.conversationstarters.com/random.php.", // needs spanish
        URBAN: "Defines a word using it's Urban Dictionary definition. Only works in NSFW channels due to potential inapropriate content.",

        CLEARNOTE: "Clears all public notes from a user's profile.",
        LOCK: "Locks a channel so users won't be able to speak in it until unlocked. (Note: if you have a role that grants message permissions this command won't work)", // needs spanish
        NOTE: "Adds a server-only public note to a user's profile.",
        PURGE: "Clears a specified amount of messages from a channel, and logs into a modlogs channel if set.", // needs spanish
        NUKE: "Completely wipes a channel of all messages. Only server owners can use this command due to the harm it may cause.", // needs spanish
        SLOWMODE: "Adds a slowmode to the channel you're in, unlike normal discord I can set a slowmode of any amount you want.", // needs spanish
        UNLOCK: "Unlocks a channel if locked. (Note: if you have a role that grants message permissions this command won't work)", // needs spanish
        WARN: "Adds a server-only warning to a user in case they break a rule, also sends em a DM to make sure they see it.", // Needs Spanish

        BLUSH: "Blush at someone.",
        BONK: "Hit someone on the head.",
        BOOP: "Boop someone on the nose.",
        CRY: "Cry at someone.",
        CUDDLE: "Cuddle with your friends.",
        DAB: "Dab on the haters.", 
        FACEPALM: "Facepalm... it explains itself.",
        HUG: "Hug your friends.",
        PAT: "Give someone headpats.",

        ANTIINVITE: "Enables or disables my automatic Discord link filtering, although I won't delete for server Admins or the server Owner.",
        DISBOARDCHANNEL: "If you use the Disboard bot you can set a channel for me to send bump reminders every two hours. Alternatively to disable these reminders you can put `fox disboardchannel none`.",
        DISBOARDMESSAGE: "Change the text I'll send ya when Disboard is off cooldown. Put `none` to reset back to my default, or just do `fox disboardmessage` to show the current message if one is set.",
        LANGUAGE: "Set the language of the guild. Choose either English, Spanish, or `none` to reset to the default.",
        MODCHANNEL: "Set the moderation logging channel of the server. If no channel is specified I will show the current channel set, if there is no channel currently set I will show none.",
        TESTJOIN: "Simulates what would happen if a new member joins the server.",
        WELCOMECHANNEL: "Set the channel where I should send welcome messages. This will initiate whenever a new member joins or you can use `fox testwelcome` to test it out beforehand.",
        WELCOMEMESSAGE: "Change the text I'll send ya when a new member joins the server. Put `none` to reset back to my default, or just do `fox welcomemessage` to show the current message if one is set.", // needs spanish

        ABOUT: "Get some basic information about me, my statistics, and some of my credits.",
        AFK: "Sets an AFK for when people ping ya. You can provide a reason, but if no reason is provided it will show as \'none\'. When pinged in chat your AFK status will show. And the next time you talk in chat your AFK will be removed.",
        AVATAR: "Get a high resolution image of a user's profile picture. In PNG, JPEG, and WEBP formats.",
        BADGES: "Gives a rough estimate for how many user badges there are in a server. Although due to Discord's limitaions this only works in smaller servers 800 members or less.", // needs spanish
        BUGREPORT: "Send a bugreport straight to the developer in case something goes wrong.", // needs spanish
        CORONA: "Get the current statistics of the Covid-19 pandemic. You can enter a country name, or global for statistics of the whole world.",
        DEFINE: "Defines a term using the Merriam-Webster Dictionary API.",
        EMBED: "Allows ya to create simple embeds using my built in syntax [title], [description], [footer], [color] make sure those are separated by commas though.", // needs spanish
        HELP: "Display help for a command when a command is specified or with no command will provide a list of all commands.",
        INFO: "Can get you information on users, servers, roles, emojis, or channels depends on what you enter.",
        INVITE: "Gives ya my invite link so you can have me help out your server.",
        PING: "Runs a connection test to Discord.",
        POLL: "Creates a poll that people can vote on. Seperate options using commas.", // needs spanish
        REMINDME: "Send a reminder message straight to your dms.",
        ROLE: "Get information about any role in the server, including perms, color, and members.",
        SAY: "Allows server moderators to use me as a puppet ;)",
        SETCOLOR: "Set the color for a role.", // needs spanish
        STEAL: "Steal any emoji from any discord server and have me automatically add it for you.", // needs spanish
        SUPPORT: "Gives ya the invite link to my support server, you can ask my dev questions or suggest new features.",
        TOP: "Allows you to search for bots on top.gg showing information about the bot searched.", // needs spanish
        UPTIME: "Shows the time since the last reboot of the bot.",
        WEATHER: "Provides the weather for a city. Supports any city in the world, will provide weather, timezone, humidity, and more.",
        WOLFRAM: "Gets a result from Wolfram|Alpha.",

    },

    MESSAGE_ERROR_CODE_ERROR: "**Uh oh,** there seems to be some sort of problem with my source code. Now don't worry I'm not dying on ya but I'd appreciate it if you did \`fox bugreport [bug]\` to send a message to my developer about it.", // needs spanish
    MESSAGE_ERROR_PERM_ERROR1: "You don't have the perms to use this command, for that you need the", // needs spanish
    MESSAGE_ERROR_PERM_ERROR2: "permission.", // needs spanish

    PERMISSIONS : {
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

    REGIONS : {
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

    VERIFICATION_LEVELS : {
        NONE: 'None',
		LOW: 'Low',
		MEDIUM: 'Medium',
		HIGH: '(╯°□°）╯︵ ┻━┻',
		VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    },

    FILTER_LEVELS : {
        DISABLED: "Don't scan any messages",
		MEMBERS_WITHOUT_ROLES: 'Scan messages from members without a role',
		ALL_MEMBERS: 'Scan messages by all members'
    }

}