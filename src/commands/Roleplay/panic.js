const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'panic',
    aliases: ['panicattack'],
    usage: `fox panic (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("panic", args, true)
    }
}