const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');
module.exports = {
    name: 'lick',
    aliases: ['taste'],
    usage: `fox lick [user] (reason)`,
    category: 'roleplay',
    execute(props) {

        let { message, args, lang } = props
        
        return new RoleplayCommand(message).execute(lang, "lick", args, false)
    }
}