const Language = require('../../lib/Language');
const { bold, code, underline, italic } = require('discord-md-tags');
const { supportServer } = require('../../config/foxxie');

module.exports = class extends Language {

    constructor(...args) {
        super(...args);
        this.language = {

            DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',
            PREFIX_REMINDER: (prefixes, prefix) => [
                `${bold`Heya!`} My prefixes for this guild are ${prefixes} and **${bold`${prefix}`}**.`,
                `For a list of all my commands, try out ${bold`${prefix}help`}.`
            ].join(' '),

            ERROR_GENERIC: (err) => `${bold`Whoops,`} an error occurred: ${err}`,

			ACTIVITY_PLAYING: 'Playing',
			ACTIVITY_LISTENING: 'Listening to',
			ACTIVITY_STREAMING: 'Streaming',

			MESSAGE_PROMPT_TIMEOUT: `${bold`Sorry,`} the prompt has timed out.`,
			MESSAGE_PROMPT_ABORT_OPTIONS: ['abort', 'stop', 'cancel'],

            // Admin Commands
            COMMAND_CREATEKEY_DESCRIPTION: `Creates a key that a user can redeem for a badge on their Info card using the ${code`redeem`} command.`,
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
            COMMAND_RELOAD_DESCRIPTION: `Reloads a Foxxie Piece without having to restart the client.`,
            COMMAND_SERVERLIST_DESCRIPTION: `Displays every guild the bot is currently in, along with their Id and membercount.`,

            // Fun Commands
            COMMAND_CAT_DESCRIPTION: `Sends me to get you a random picture of a cat from https://api.thecatapi.com`,
            COMMAND_DOG_DESCRIPTION: `Sends me to get you a random picture of a dog from https://dog.ceo/api`,
            COMMAND_FOX_DESCRIPTION: `I'll go and get you a picture of one of my family members from https://randomfox.ca`,
            COMMAND_FOXFACT_DESCRIPTION: `I'll provide you with a cool fact about foxes from https://some-random-api.ml/facts/fox`,
            COMMAND_POKEMON_DESCRIPTION: `I'll provide you with some stats about a pokemon you specify. This command also takes advantage of my flags feature, add ${code`-s`} after the pokemon for me to show it's shiny sprite instead of the normal.`,
            COMMAND_TOPIC_DESCRIPTION: `I'll get you a random conversation starter for when your chat starts to doze off. Powered by https://www.conversationstarters.com`,
            COMMAND_URBAN_DESCRIPTION: `I'll get you data from an urban dictionary word you provide, including link, upvotes, definition, and examples.`,

            // Moderation Commands
            COMMAND_BAN_DESCRIPTION: [
                `Bans users from the server so they can no longer join.`,
                `Formatting time like ${code`1d`} for one day, you can temporarily ban users and have them automatically be unbanned after a specified time period.`,
                `This command also takes advantage of my message flags feature, adding ${code`-p`} to the message with automatically clear one days worth of the user's messages.\n`,
                `If a moderation logging channel is set in your server, this command will log there, and send a DMs to the users banned, with the provided reason.`
            ].join('\n'),
            COMMAND_WARN_DESCRIPTION: `Adds warnings to members that will show on their ${code`info`} profile.\nIf a moderation logging channel is set in your server, this command will log there, and send DMs to the members warned, with the provided reason.`,

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
            COMMAND_PING_DESCRIPTION: `Runs a connection test to Discord.`
        }
    }
}