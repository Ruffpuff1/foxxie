const { Util, Language, bold, code, underline, italic } = require('foxxie');
const { supportServer } = require('../../config/foxxie');
const { emojis: { infinity, perms: { notSpecified } } } = require('../../lib/util/constants');

module.exports = class extends Language {

    constructor(...args) {
        super(...args);
        this.language = {

            DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',
            PREFIX_REMINDER: (prefixes, prefix) => [
                `${bold`Heya!`} My prefixes for this guild are ${prefixes} and **${code`${prefix}`}**.`,
                `For a list of all my commands, try out ${code`${prefix}help`}.`
            ].join(' '),

            ERROR_GENERIC: (err) => `${bold`Whoops,`} an error occurred: ${Util.codeBlock('js', err)}`,

			ACTIVITY_PLAYING: 'Playing',
			ACTIVITY_LISTENING: 'Listening to',
			ACTIVITY_STREAMING: 'Streaming',

            MESSAGE_LOADING: `${infinity} ${bold`Alright, I'm taking your order.`} This may take a few seconds.`,
            MESSAGE_MEMBERS_NONE: `You need to specify at least ${bold`one member`}.`,
            MESSAGE_PROMPT_CANCELLED: `Command ${bold`cancelled`}.`,
			MESSAGE_PROMPT_TIMEOUT: `${bold`Sorry,`} the prompt has timed out.`,
			MESSAGE_PROMPT_ABORT_OPTIONS: ['abort', 'stop', 'cancel'],
            MESSAGE_USERS_NONE: `You need to specify at least ${bold`one user`}.`,

            // Admin Commands
            COMMAND_CREATEKEY_DESCRIPTION: `Creates a key that a user can redeem for a badge on their Info card using the ${code`redeem`} command.`,
            COMMAND_CREATEKEY_NOID: `${bold`Hey,`} you didn't provide a proper Id. This command is locked to the bot owner due to it's special nature.`,
            COMMAND_CREATEKEY_SUCCESS: (icon, name, key) => `${bold`Success!`} here is a key for ${icon} ${name}: ${code`${key}`}.`,
            COMMAND_DISABLE_DESCRIPTION: `Disables a Foxxie piece so it can no longer be used, if specified piece is a command it will be hidden from the ${bold`help`} command. This command is locked to the bot owner due to the power it has.`,
            COMMAND_DISABLE_NOPIECE: `${bold`Please`} specify a piece to disable.`,
            COMMAND_DISABLE_WARN: `${bold`Hey,`} you shouldn't disable this piece because if you do, you won't be able to re-enable it.`,
            COMMAND_ENABLE_DESCRIPTION: `Enables a Foxxie piece so it can continue being used. This command is locked to the bot owner due to the power it has.`,
            COMMAND_ENABLE_NOPIECE: `${bold`Please`} specify a piece to enable.`,
            COMMAND_EVAL_DESCRIPTION: [
                `Allows you evaluate JavaScript code straight from Discord. This command is locked to the bot owner due to the power it has.\n`,
                `The eval command evaluates code as-in, any error thrown from it will be handled.`,
                `This command also takes advantage of my message flags feature. Write any of the following to cusomize your output:\n`,
                `- The ${code`-silent`} flag will make it output silently or nothing.`,
                `- The ${code`-depth`} flag accepts a number, for example ${code`-depth=2`}, to cusomize the depth of util.inspect.`,
                `- The ${code`-async`} flag will wrap the input in an asynchonus function, allowing the use of await, however if you want to return something, you will need to use the return keyword.`,
                `- The ${code`-message`} flag will output the result as a Discord message.\n`,
                `If the output is too long it will automatically splice to fit inside of the message.`,
            ].join('\n'),
            COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_OUTPUT: (time, output, type) => `**Output**:${output}\n**Type**:${type}\n${time}`,
            COMMAND_RELOAD_DESCRIPTION: `Reloads a Foxxie Piece without having to restart the client. This command is locked to the bot owner due to it's special nature.`,
            COMMAND_RELOAD_ERROR: (name, error) => `${bold`Uh oh,`} failed to reload ${name}${Util.codeBlock('js', error)}`,
            COMMAND_RELOAD_NONE: `${bold`Whoops,`} please specify a piece to reload [Command | Monitor | Language ].`,
            COMMAND_RELOAD_SUCCESS: (name, type, time) => `${bold`Successfully`} reloaded ${type}: ${bold`${name}`}. (Took ${time})`,
            COMMAND_SERVERLIST_DESCRIPTION: `Displays every guild the bot is currently in, along with their Id and membercount. This command is locked to the bot owner due to privacy concerns.`,
            COMMAND_SERVERLIST_FOOTER: (size, page, totalPages) => `${size} total servers\nPage - ${page}/${totalPages}`,
            COMMAND_SERVERLIST_MEMBERCOUNT: `members`,
            COMMAND_SERVERLIST_TITLE: `Servers using Foxxie`,

            // Fun Commands
            COMMAND_CAT_DESCRIPTION: `Sends me to get you a random picture of a cat from https://api.thecatapi.com`,
            COMMAND_CAT_FOOTER: `From api.thecatapi.com`,
            COMMAND_CAT_TITLE: `Random Cat`,
            COMMAND_DOG_DESCRIPTION: `Sends me to get you a random picture of a dog from https://dog.ceo/api`,
            COMMAND_DOG_FOOTER: `From dog.ceo/api`,
            COMMAND_DOG_TITLE: `Random Dog`,
            COMMAND_FOX_DESCRIPTION: `I'll go and get you a picture of one of my family members from https://randomfox.ca`,
            COMMAND_FOX_FOOTER: `From randomfox.ca/floof`,
            COMMAND_FOX_TITLE: `Random Fox:`,
            COMMAND_FOXFACT_DESCRIPTION: `I'll provide you with a cool fact about foxes from https://some-random-api.ml/facts/fox`,
            COMMAND_FOXFACT_NOFACT: `${bold`Whoops,`} there was an error fetching your fact.`,
            COMMAND_HOWGAY: (user, percent) => `:rainbow_flag: ${bold`${user}`} is ${bold`${percent}%`} gay.`,
            COMMAND_HOWGAY_DESCRIPTION: `Truly determine how gay a user is.`,
            COMMAND_OWOIFY_DESCRIPTION: `Transforms given text into owo speak. This command also takes advantage of my message flags feature, add ${code`-d`} to your message to automatically delete it.`,
            COMMAND_OWOIFY_NOARGS: `${bold`Hey,`} u nyeed two pwovide swomwething two owoify. :pleading_face:`,
            COMMAND_POKEMON_DESCRIPTION: `I'll provide you with some stats about a pokemon you specify. This command also takes advantage of my flags feature, add ${code`-s`} after the pokemon for me to show it's shiny sprite instead of the normal.`,
            COMMAND_POKEMON_ATTACK: bold`Attack`,
            COMMAND_POKEMON_BASEXP: bold`Base Exp`,
            COMMAND_POKEMON_DEFENSE: bold`Defense`,
            COMMAND_POKEMON_HEIGHT: bold`Height`,
            COMMAND_POKEMON_INVALID: `${bold`Looks`} like that pokemon is invalid! How bout an actual one this time oki?`,
            COMMAND_POKEMON_NOARGS: `${bold`Cmon,`} you gotta enter a pokemon for me to show.`,
            COMMAND_POKEMON_SPECIALATTACK: bold`Special Atk`,
            COMMAND_POKEMON_SPECIALDEFENSE: bold`Special Def`,
            COMMAND_POKEMON_SPEED: bold`Speed`,
            COMMAND_POKEMON_TYPE: bold`Type`,
            COMMAND_POKEMON_WEIGHT: bold`Weight`,
            COMMAND_TOPIC_DESCRIPTION: `I'll get you a random conversation starter for when your chat starts to doze off. Powered by https://www.conversationstarters.com`,
            COMMAND_URBAN_DESCRIPTION: `I'll get you data from an urban dictionary word you provide, including link, upvotes, definition, and examples.`,
            COMMAND_URBAN_EXAMPLE: bold`Example`,
            COMMAND_URBAN_FOOTER: author => `By ${author}`,
            COMMAND_URBAN_NODATA: `${bold`Yikes,`} sorry I couldn't find any data for that term.`,
            COMMAND_URBAN_NODEFINITION: `No definition available.`,
            COMMAND_URBAN_NOEXAMPLE: `No example available.`,
            COMMAND_URBAN_NOWORD: `${bold`Okay,`} how do you expect me to define a word if you don't provide one?`,

            // Moderation Commands
            COMMAND_BAN_DESCRIPTION: [
                `Bans users from the server so they can no longer join.`,
                `Formatting time like ${code`1d`} for one day, you can temporarily ban users and have them automatically be unbanned after a specified time period.`,
                `This command also takes advantage of my message flags feature, adding ${code`-p`} to the message will automatically clear one days worth of the user's messages.\n`,
                `If a moderation logging channel is set in your server, this command will log there, and send DMs to the users banned, with the provided reason.`
            ].join('\n'),
            COMMAND_BAN_ERROR: (user, issue) => `${bold`Whoops`} I couldn't ban ${bold`${user}`}:${Util.codeBlock('js', issue)}`,
            COMMAND_BAN_NOPERMS: multiple => `${bold`Hey,`} you cannot ban ${multiple ? 'any of the specified users' : 'the specified user'}.`,
            COMMAND_NUKE: `${bold`First hehe,`} anyways this channel was nuked by the owner of the server. All previous messages have been cleared out.`,
            COMMAND_NUKE_DESCRIPTION: `Completely wipes a channel of all messages and clones its permissions, topic, and position. Only server owners can use this command due to the harm it may cause. Also keep in mind: mine or any other bot's settings will no longer work in that channel. If a moderation logging channel is set in your server, this command will log there.`,
            COMMAND_NUKE_WARNING: (author, channel) => `${author}, ya sure you want to nuke this channel? This will get rid of ${bold`all messages`} in the channel and ${bold`can't be undone`}. If you're positive go ahead and type ${code`yes, nuke ${channel}`} within the next 30 seconds. If you'd like to cancel just send ${code`cancel`} or any other message. Also, gotta tell you that this simply clones the channel meaning some settings from myself or other bots won't work anymore.`,
            COMMAND_STAFFLOG_DESCRIPTION: `Shows a list of moderation actions performed by a member of your server.`,
            COMMAND_STAFFLOG_NONE: member => `${bold`${member}`} has not performed any moderation actions.`,
            COMMAND_STAFFLOG_ONE: (member, ban, kick, warn, jail, mute) => [
                underline`Moderation logs for ${bold`${member}`}:\n`,
                ban ? `${notSpecified} Issued ${ban.toLocaleString()} ${bold`ban${ban === 1 ? '' : 's'}`}` : null,
                kick ? `${notSpecified} Issued ${kick.toLocaleString()} ${bold`kick${kick === 1 ? '' : 's'}`}` : null,
                warn ? `${notSpecified} Issued ${warn.toLocaleString()} ${bold`warn${warn === 1 ? '' : 's'}`}` : null,
                jail ? `${notSpecified} Issued ${jail.toLocaleString()} ${bold`jail${jail === 1 ? '' : 's'}`}` : null,
                mute ? `${notSpecified} Issued ${mute.toLocaleString()} ${bold`mute${mute === 1 ? '' : 's'}`}` : null,
            ].filter(a => !!a).join('\n'),
            COMMAND_STAFFLOG_TWO: (slow, lock, unlock, nuke, purge, total) => [
                slow ? `${notSpecified} Performed ${slow.toLocaleString()} ${bold`slowmode${slow === 1 ? '' : 's'}`}` : null,
                lock ? `${notSpecified} Performed ${lock.toLocaleString()} ${bold`lock${lock === 1 ? '' : 's'}`}` : null,
                unlock ? `${notSpecified} Performed ${unlock.toLocaleString()} ${bold`unlock${unlock === 1 ? '' : 's'}`}` : null,
                nuke ? `${notSpecified} Completed ${nuke.toLocaleString()} ${bold`nuke${nuke === 1 ? '' : 's'}`}` : null,
                purge ? `${notSpecified} Performed ${purge.toLocaleString()} ${bold`purge${purge === 1 ? '' : 's'}`} (${bold`${total.toLocaleString()}`} message${total === 1 ? '' : 's'})` : null
            ].filter(a => !!a).join('\n'),
            COMMAND_VCUNMUTE_DESCRIPTION: `I will unmute the specified members if they are in a vc and server muted. If a moderation logging channel is set, this action will log there.`,
            COMMAND_VCUNMUTE_NOPERMS: multiple => `${bold`Hey,`} you can't unmute ${multiple ? `any of the specified members` : `the specified member`} from vc.`,
            COMMAND_VCUNMUTE_NOVOICE: multiple => `${multiple ? `${bold`None`} of the specified members are` : `${bold`Hey,`} the specified member is not`} in vc or muted.`,
            COMMAND_WARN_DESCRIPTION: `Adds warnings to members that will show on their ${code`info`} profile.\nIf a moderation logging channel is set in your server, this command will log there, and send DMs to the members warned, with the provided reason.`,
            COMMAND_WARN_NOPERMS: multiple => `${bold`Sorry,`} you can't warn ${multiple ? 'any of the specified members' : 'the specified member'}.`,

            // Roleplay Commands
            COMMAND_ANGRY_DESCRIPTION: `Get angry at someone (ಠ_ಠ)`,
            COMMAND_BLUSH_DESCRIPTION: `Start blushing at someone.`,
            COMMAND_BONK_DESCRIPTION: `Bonk someone's head (go to horny jail).`,
            COMMAND_BOOP_DESCRIPTION: `Give someone a cute little boop on the nose.`,
            COMMAND_CRY_DESCRIPTION: `Cry at/because of somebody (T-T).`,
            COMMAND_CUDDLE_DESCRIPTION: `Give someone a cozy, warm cuddle.`,
            COMMAND_DAB_DESCRIPTION: `Dab on the haters.`,
            COMMAND_FACEPALM_DESCRIPTION: `Facepalm yourself due to someone's stupidity.`,
            COMMAND_HUG_DESCRIPTION: `Give someone a tight, loving hug (and never let them go).`,
            COMMAND_KILL_DESCRIPTION: `Kill someone (dont worry the cops won't see you).`,
            COMMAND_KISS_DESCRIPTION: `Give someone a cute kiss (^3^).`,
            COMMAND_LICK_DESCRIPTION: `Give someone a licky lick.`,
            COMMAND_LURK_DESCRIPTION: `Lurk in the distance and stare at someone, ${italic`totally not wierd`}.`,
            COMMAND_NOM_DESCRIPTION: `Lightly bite someone (om nom nom).`,
            COMMAND_PANIC_DESCRIPTION: `Get panicked (aaaaaaaaaaa).`,
            COMMAND_PAT_DESCRIPTION: `Give someone a pat on their head.`,
            COMMAND_PECK_DESCRIPTION: `Give someone a peck on the cheek.`,
            COMMAND_SHOOT_DESCRIPTION: `Shoot someone ${italic`pew pew`}.`,
            COMMAND_SHRUG_DESCRIPTION: `Shrug at someone.`,
            COMMAND_SIP_DESCRIPTION: `Passive-aggresively sip at someone.`,
            COMMAND_SLAP_DESCRIPTION: `Give someone a big fat slap (wham).`,
            COMMAND_SLEEP_DESCRIPTION: `Go to sleep (ya seriously need it)`,
            COMMAND_STAB_DESCRIPTION: `Poke a knife at someone very hard (caution: there will be blood).`,
            COMMAND_STARE_DESCRIPTION: `Just stare at someone.`,
            COMMAND_TEASE_DESCRIPTION: `Tease someone. :p`,
            COMMAND_WAVE_DESCRIPTION: `Wave someone hello/goodbye.`,

            // Secret Commands
            COMMAND_ARI_DESCRIPTION: ``,
            COMMAND_ASH_DESCRIPTION: ``,
            COMMAND_DEI_DESCRIPTION: ``,
            COMMAND_JUSTIN_DESCRIPTION: ``,
            COMMAND_JUSTIN_NAME: (user, name) => `${bold`Here is the full name of`} ${user}:\n${italic`${name}`}`,
            COMMAND_RAIN_DESCRIPTION: ``,
            COMMAND_REESE_DESCRIPTION: ``,
            COMMAND_RUFF_DESCRIPTION: ``,
            COMMAND_SAMI_DESCRIPTION: ``,
            COMMAND_STRAX_DESCRIPTION: ``,

            // Util Commands
            COMMAND_HELP_CATEGORY: `Command Category`,
            COMMAND_HELP_DESCRIPTION: ``,
            COMMAND_HELP_EXPLAINER: prefix => [
                `With my ${code`help`} command you can get information about any of my commands straight from Discord.`,
                `To get a short overview of any command just run ${code`${prefix}help [Command]`}\n`,
                `The syntax for usage is very simple aswell:`,
                `Square brackets ${code`[]`} indicate an argument is required, parenthesis ${code`()`} indicate an argument is optional, and a pipe ${code`|`} between arguements indicates that you can choose between the two.\n`,
                `If you need any further help be sure to join my [support server](${supportServer}).`
            ].join('\n'),
            COMMAND_HELP_MENU: prefix => `These are my commands, for additional info on a certain one of them just do ${code`${prefix}help (command)`}.`,
            COMMAND_HELP_NOTVALID: `${bold`Sorry,`} that doesn't seem to be one of my commands.`,
            COMMAND_HELP_PERMISSIONS: `Required Permissions`,
            COMMAND_HELP_SERVERONLY: `Server Only`,
            COMMAND_HELP_TITLE: name => `${name}'s Commands!`,
            COMMAND_HELP_USAGE: `Usage`,
            COMMAND_PING: `Ping?`,
            COMMAND_PING_DESCRIPTION: `Runs a connection test to Discord.`,
            COMMAND_PINGPONG: (total, discord, ws) => `🏓 ${bold`Pong!`} Took ${bold`${total}`}ms (Discord latency: ${bold`${discord}`}ms. Network latency: ${bold`${ws}`}ms.)`,

            // Inhibitors
            INHIBITORS_PERMISSIONS_AUTHOR: perm => `${bold`You don't`} have permission to run this command, you need the ${bold`${perm}`} permission.`,
            INHIBITORS_PERMISSIONS_GUILDOWNER: `${bold`Nope,`} due to the harm this command can cause it can only be executed by the guild owner.`,

            // Logging
            LOG_ACTION_DELETE: `Message Deleted`,
            LOG_ACTION_EDIT: `Message Edited`,
            LOG_ACTION_NUKE: `Channel Nuked`,
            LOG_ACTION_TEMPBAN: multiple => `Temporarily Banned User${multiple ? 's' : ''}`,
            LOG_ACTION_TEMPUNBAN: multiple => `Removed Temporary Ban from User${multiple ? 's' : ''}`,
            LOG_ACTION_VCUNMUTE: multiple => `Unmuted User${multiple ? 's' : ''} in vc.`,
            LOG_ACTION_WARN: multiple => `Warned User${multiple ? 's' : ''}`,

            LOG_ARGS_ATTACHMENTS: attachments => `${bold`Attachments`}: ${attachments.join(` | `)}`,
            LOG_ARGS_CHANNEL: (mention, id) => `${bold`Location`}: ${mention} (ID: ${id})`,
            LOG_ARGS_DATE: date => `${bold`Date`}: ${date}`,
            LOG_ARGS_DURATION: duration => `${bold`Duration`}: ${duration}`,
            LOG_ARGS_IMAGES: `Image`,
            LOG_ARGS_LINK: link => `${bold`Link`}: [Here](${link})`,
            LOG_ARGS_MEMBER: (name, mention, id) => `${bold`Member`}: ${name} ${mention} (ID: ${id})`,
            LOG_ARGS_MESSAGE: content => `${bold`Message`}: ${content}`,
            LOG_ARGS_MESSAGES: (oldContent, newContent) => [
                `${bold`Before`}: ${oldContent}`,
                `${bold`After`}: ${newContent}`,
            ].join(oldContent.length > 45 ? '\n\n' : '\n'),
            LOG_ARGS_MODERATOR: (tag, mention, id) => `${bold`Moderator`}: ${tag} ${mention} (ID: ${id})`,
            LOG_ARGS_REASON: reason => `${bold`Reason`}: ${reason}`,
            LOG_ARGS_USER: (tag, mention, id) => `${bold`User`}: ${tag} ${mention} (ID: ${id})`,
            LOG_ARGS_USERS: users => `${bold`Users`}:\n${users}\n`,
            LOG_ARGS_WARN: (reason, time, tag, author, id) => `${bold`Warn`}: ${reason}\non ${time}\nBy: ${tag} ${author} (ID: ${id})`,
            LOG_ARGS_WARNS: warns => `${bold`Warns`}: ${warns}`,

            LOG_DM_TEMPBAN: `You have been temporarily banned`,
            LOG_DM_TEMPUNBAN: `Your temporary ban has expired`,
            LOG_DM_VCUNMUTE: `You have been unmuted in vc`,
            LOG_DM_WARN: `You have been warned`,

            LOG_MODERATION_NOREASON: `No reason specified.`
        }
    }
}