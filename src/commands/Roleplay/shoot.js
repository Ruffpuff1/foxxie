const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'shoot',
    aliases: ['snipe', 'longshot', 'quickscope', 'driveby'],
    usage: `fox shoot [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "shoot", args, false)
    }
}