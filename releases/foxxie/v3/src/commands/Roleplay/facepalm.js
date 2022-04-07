const { roleplayCommand } = require('../../../lib/structures/roleplayCommands')
module.exports = {
    name: 'facepalm',
    aliases: ['dumb'],
    usage: `fox facepalm [user] (reason)`,
    category: 'roleplay',
    execute(lang, message, args) {
        
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
    
        let text = args.slice(1).join(' ');

        let command = 'facepalm';
        let actionText = 'facepalms at';

        roleplayCommand(message, command, mentionMember, text, actionText)
    }
}