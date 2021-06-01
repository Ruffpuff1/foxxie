const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'angry',
    aliases: ['mad', 'triggered'],
    usage: `fox angry (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("angry", args, true)
    }
}