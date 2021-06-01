const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'stab',
    aliases: ['knife', 'shank'],
    usage: `fox stab [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("stab", args, false)
    }
}