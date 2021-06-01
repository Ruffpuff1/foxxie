const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'facepalm',
    aliases: ['dumb'],
    usage: `fox facepalm (user) (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args } = props
        
        return new RoleplayCommand(message).execute("facepalm", args, true)
    }
}