const { emojis: { infinity } } = require('../../lib/util/constants')

module.exports = {

    english: {
        DEFAULT: (key) => `${key} has not been localised for en-US yet.`,
        PREFIX_REMINDER: (prefix) => `**Heya!** My prefixes are \`fox\` and \`${prefix}\`. Try out \`fox help\` to get a list of my commands and sections.`,

        MESSAGE_LOADING: () => `${infinity} **Alright, I'm taking your order.** This may take a few seconds.`,

        // Responders
        RESPONDER_ERROR_CODE: () => `**Uh oh,** there seems to be some sort of problem with my source code. Now don't worry I'm not dying on ya but I'd appreciate it if you did \`fox bugreport [bug]\` to send a message to my developer about it.`,
        RESPONDER_ERROR_FOXFACT: () => `**Whoops,** there was some sort of error while fetching your fact, do try again please.`,
        RESPONDER_ERROR_PERMS_AUTHOR: (perm) => `You don't have the perms to use this command, for that you need the \`${perm}\` permission.`,
        RESPONDER_ERROR_PERMS_CLIENT: (perm) => `I don't have the correct permissions to run this command! I need the \`${perm}\` permission in this channel. As an alternative you can give my role the \`ADMINISTRATOR\` permission to bypass this issue.`,
        RESPONDER_FOXXIE_CUBBY_WRONG_CHANNEL: (msg) => `${msg.member}, this channel **isnt** meant to test out my commands. For that, you should head over to <#825896913810358274>.`,
        RESPONDER_TCS_MIMU_PICK: () => `**Darlin\'** I\'m flattered you want to pick me but again mimu\'s prefix is \`?\`.`,

        // Automation Commands
        // Dev Commands

        // Fun Commands
        COMMAND_CAT_DESCRIPTION: () => `Sends me to get you a random picture of a cat from https://api.thecatapi.com`,
        COMMAND_CAT_TITLE: () => `Random Cat:`,
        COMMAND_CAT_FOOTER: () => `From api.thecatapi.com`,
        COMMAND_DOG_DESCRIPTION: () => `Sends me to get you a random picture of a dog from https://dog.ceo/api`,
        COMMAND_DOG_TITLE: () => `Random Dog:`,
        COMMAND_DOG_FOOTER: () => `From dog.ceo/api`,
        COMMAND_FOX_DESCRIPTION: () => `I'll go and get you a picture of one of my family members from https://randomfox.ca`,
        COMMAND_FOX_TITLE: () => `Random Fox:`,
        COMMAND_FOX_FOOTER: () => `From randomfox.ca/floof`,
        COMMAND_FOXFACT_DESCRIPTION: () => `I'll provide you with a cool fact about foxes from https://some-random-api.ml/facts/fox`,
        COMMAND_POKEMON_DESCRIPTION: () => `I'll provide you with some stats about a pokemon you specify. This command also uses my flags feature, add \`-s\` or \`-shiny\` after the pokemon for me to show it's shiny sprite instead of the normal.`,
        COMMAND_POKEMON_FIELD_ATTACK: () => `**Attack**`,
        COMMAND_POKEMON_FIELD_BASEXP: () => `**Base Exp**`,
        COMMAND_POKEMON_FIELD_DEFENSE: () => `**Defense**`,
        COMMAND_POKEMON_FIELD_HEIGHT: () => `**Height**`,
        COMMAND_POKEMON_FIELD_SPECIALATTK: () => `**Special Atk**`,
        COMMAND_POKEMON_FIELD_SPECIALDEF: () => `**Special Def**`,
        COMMAND_POKEMON_FIELD_SPEED: () => `**Speed**`,
        COMMAND_POKEMON_FIELD_TYPE: () => `**Type**`,
        COMMAND_POKEMON_FIELD_WEIGHT: () => `**Weight**`,
        COMMAND_POKEMON_INVALIDPOKEMON: () => `**Hey,** that Pokemon is invalid! How bout an actual one this time oki?`,
        COMMAND_POKEMON_NOPOKEMON: () => `**Cmon,** you gotta enter a pokemon for me to show.`,
        COMMAND_TOPIC_DESCRIPTION: () => `I'll get you a random conversation starter for when your chat starts to doze off. Powered by https://www.conversationstarters.com`,
        COMMAND_URBAN_DESCRIPTION: () => `I'll get you data from an urban dictionary word you provide, including link, upvotes, definition, and examples.`,
        COMMAND_URBAN_EXAMPLE: () => `**Example**`,
        COMMAND_URBAN_FOOTER: (res) => `By ${res[0].data.list[3].author}`,
        COMMAND_URBAN_NODATA: () => `**Yikes,** sorry I couldn't find any data for that word.`,
        COMMAND_URBAN_NODEFINITION: () => `No definition available.`,
        COMMAND_URBAN_NOEXAMPLE: () => `No example available.`,
        COMMAND_URBAN_NOWORD: () => `**Okay,** how do you expect me to define a word if you don't provide one?`,

        // Moderation Commands
        // Roleplay Commands
        // Secret Commands
        // Settings Commands

        // Utility Commands
        COMMAND_PING: () => `Ping?`,
        COMMAND_PING_DESCRIPTION: () => `Runs a connection test to discord and tells ya how long it'll take for me to respond.`,
        COMMAND_PING_DISCORD: () => `Discord Latency`,
        COMMAND_PING_FOOTER: () => `Ping may be high due to Discord breaking, not my problem.`,
        COMMAND_PING_NETWORK: () => `Network Latency`,
        COMMAND_PING_PONG: () => `**Pong**`

        // Events
        // Inhibitors
        // Logs
        // Monitors
        // Resolvers
        // Tasks
        // 8 Ball
    }
}