const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'tease',
    usage: `fox tease (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("tease", args, true)
    }
}