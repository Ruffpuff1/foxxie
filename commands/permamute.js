const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'permamute',
    description: 'Mutes someone permanently, not allowing them to ever talk.',
    aliases: ["permmute", "pm", "glueshut"],
    permissions: 'MANAGE_MESSAGES',

    async execute(message, args, bot){
        if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply(`You do know i can't do anything without **permissions** right? better give me some if you wanna do anything.`);
const member = message.mentions.members.first();
if(!member) return message.reply(`You can’t mute what’s not there, dummy. Next time, actually specify someone to receive the punishment. <:SRAnimeSmart:826075836246786128>`)
let time = Math.floor(args[1]);
let role = message.guild.roles.cache.get(`827204149656420393`);
if(!role) return;
if(member.roles.cache.has(role.id)) return message.reply(`Do you even use your eyes, love? This user is already muted.`)
if(member.id === message.author.id) return message.reply(`imagine being that desperate to be muted lmao.`);
if(!time){
    await member.roles.add(role.id).catch(err => console.log(err))
    .then(m => message.channel.send(`**${message.author.username}** has muted **${member.user.username}** indefinitely. They will not be able to talk on the server anymore.`));
} else {
    await members.role.add(role.id).catch(err => console.log(err))
    .then(m => message.channel.send(`${member.user.tag} is now muted luv.`));
    setTimeout(async function() {
        await member.roles.remove(role.id).catch(err => console.log(err));
    }, ms(time))
    
    }
}
}