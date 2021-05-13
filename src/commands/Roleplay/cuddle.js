const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'cuddle',
    usage: `fox cuddle [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "cuddle", args, false)
    }
}