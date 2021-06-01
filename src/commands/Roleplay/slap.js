const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'slap',
    aliases: ['punch'],
    usage: `fox slap [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("slap", args, false)
    }
}