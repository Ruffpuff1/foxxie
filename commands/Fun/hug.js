const Discord = require('discord.js');
module.exports = {
    name: 'hug',
    description: 'Roleplay for hug command',
    execute(message, args, bot) {
        bot.users.cache.find(r => r.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
        var user = message.mentions.users.first();
        const hugs = ["https://media.discordyui.net/reactions/hug/JwU3EPy.gif", "https://media.discordyui.net/reactions/hug/4564564564.gif", "https://cdn.weeb.sh/images/HJ7lY_QwW.gif", "https://cdn.weeb.sh/images/HyNJIaVCb.gif", "https://cdn.weeb.sh/images/BJx2l0ttW.gif", "https://cdn.weeb.sh/images/HJU2OdmwW.gif", "https://cdn.weeb.sh/images/SyQ0_umD-.gif", "https://cdn.weeb.sh/images/rkYetOXwW.gif", "https://cdn.weeb.sh/images/H1X6OOmPW.gif", "https://cdn.weeb.sh/images/S1DyFuQD-.gif", "https://media1.tenor.com/images/4d89d7f963b41a416ec8a55230dab31b/tenor.gif?itemid=5166500",    "https://media1.tenor.com/images/f5df55943b64922b6b16aa63d43243a6/tenor.gif?itemid=9375012",    "https://media1.tenor.com/images/506aa95bbb0a71351bcaa753eaa2a45c/tenor.gif?itemid=7552075",    "https://media1.tenor.com/images/16f4ef8659534c88264670265e2a1626/tenor.gif?itemid=14903944",    "https://media1.tenor.com/images/e9d7da26f8b2adbb8aa99cfd48c58c3e/tenor.gif?itemid=14721541",   "https://media1.tenor.com/images/3b14c13b07ae95649ffef7d855a2f5d1/tenor.gif?itemid=20556765",    "https://media1.tenor.com/images/4db3a7f7a8c6f97bf1711c1752e766af/tenor.gif?itemid=20556781",    "https://media1.tenor.com/images/33534833bb4a81dcd1b7a3540b069ca3/tenor.gif?itemid=20556797",    "https://media1.tenor.com/images/a211f33e4ff688f9101a46ed95f2fb21/tenor.gif?itemid=20556812",    "https://media1.tenor.com/images/249e80e40c76b60ae91a4a29d669e54b/tenor.gif?itemid=20556829",    "https://media1.tenor.com/images/bd7554e3cc115e9851d836fe6c555f64/tenor.gif?itemid=20379697",    "https://media1.tenor.com/images/0022315b49ced4bb72114011a4932580/tenor.gif?itemid=12480522" 
    ];
        var url = hugs[Math.floor(Math.random() * hugs.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setDescription(`**${user}** was hugged by **${message.member}**`)
        embed.setImage(url)
        message.channel.send(embed)
    },
};


