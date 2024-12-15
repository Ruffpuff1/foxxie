const { roleplayCommand } = require('../../../lib/structures/roleplayCommands')
module.exports = {
    name: 'peck',
    aliases: ['butterfly-kiss'],
    usage: `fox peck [user] (reason)`,
    category: 'roleplay',
    execute(lang, message, args) {
        
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
    
        let text = args.slice(1).join(' ');

        let command = 'peck';
        let actionText = 'gave a peck to';

        roleplayCommand(message, command, mentionMember, text, actionText)
    }
}