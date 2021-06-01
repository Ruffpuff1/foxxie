const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'blush',
    aliases: ['happy', 'smile'],
    usage: `fox blush (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("blush", args, true)
    }
}