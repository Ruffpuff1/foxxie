const { emojis: { infinity } } = require('../../lib/util/constants')

module.exports = {

    template: {
        DEFAULT: (key) => ``,
        PREFIX_REMINDER: (prefix) => ``,

        MESSAGE_LOADING: () => ``,

        // Responders
        RESPONDER_ERROR_CODE: () => ``,
        RESPONDER_ERROR_FOXFACT: () => ``,
        RESPONDER_ERROR_PERMS_AUTHOR: (perm) => ``,
        RESPONDER_ERROR_PERMS_CLIENT: (perm) => ``,
        RESPONDER_FOXXIE_CUBBY_WRONG_CHANNEL: (msg) => ``,
        RESPONDER_TCS_MIMU_PICK: () => ``,
        // Automation Commands
        // Dev Commands
        // Fun Commands
        COMMAND_CAT_DESCRIPTION: () => ``,
        COMMAND_CAT_TITLE: () => ``,
        COMMAND_CAT_FOOTER: () => ``,
        COMMAND_DOG_DESCRIPTION: () => ``,
        COMMAND_DOG_TITLE: () => ``,
        COMMAND_DOG_FOOTER: () => ``,
        COMMAND_FOX_DESCRIPTION: () => ``,
        COMMAND_FOX_TITLE: () => ``,
        COMMAND_FOX_FOOTER: () => ``,
        COMMAND_FOXFACT_DESCRIPTION: () => ``,
        COMMAND_POKEMON_DESCRIPTION: () => ``,
        COMMAND_POKEMON_FIELD_ATTACK: () => ``,
        COMMAND_POKEMON_FIELD_BASEXP: () => ``,
        COMMAND_POKEMON_FIELD_DEFENSE: () => ``,
        COMMAND_POKEMON_FIELD_HEIGHT: () => ``,
        COMMAND_POKEMON_FIELD_SPECIALATTK: () => ``,
        COMMAND_POKEMON_FIELD_SPECIALDEF: () => ``,
        COMMAND_POKEMON_FIELD_SPEED: () => ``,
        COMMAND_POKEMON_FIELD_TYPE: () => ``,
        COMMAND_POKEMON_FIELD_WEIGHT: () => ``,
        COMMAND_POKEMON_INVALIDPOKEMON: () => ``,
        COMMAND_POKEMON_NOPOKEMON: () => ``,
        COMMAND_TOPIC_DESCRIPTION: () => ``,
        COMMAND_URBAN_DESCRIPTION: () => ``,
        COMMAND_URBAN_EXAMPLE: () => ``,
        COMMAND_URBAN_FOOTER: (res) => ``,
        COMMAND_URBAN_NODATA: () => ``,
        COMMAND_URBAN_NODEFINITION: () => ``,
        COMMAND_URBAN_NOEXAMPLE: () => ``,
        COMMAND_URBAN_NOWORD: () => ``,
        // Moderation Commands
        // Roleplay Commands
        // Secret Commands
        // Settings Commands
        // Utility Commands
        COMMAND_PING: () => ``,
        COMMAND_PING_DISCORD: () => ``,
        COMMAND_PING_FOOTER: () => ``,
        COMMAND_PING_NETWORK: () => ``,
        COMMAND_PING_PONG: () => ``,
        // Events
        // Inhibitors
        // Logs
        // Monitors
        // Resolvers
        // Tasks
        // 8 Ball
    }
}