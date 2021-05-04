const Discord = require('discord.js');
module.exports = {
    name: 'pat',
    description: 'Lets you pat someone.',
    execute(message, args) {
        var user = message.mentions.users.first();
        const pat= ["https://cdn.discordapp.com/attachments/802211985063542816/802568225514192906/8.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568230853804052/6.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568260482367548/3.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568237396131840/2.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568200616804372/1.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568275452100648/12.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568313560760370/11.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568250772553738/9.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568262276612116/4.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568237677674536/0.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568293587091466/5.gif", "https://cdn.discordapp.com/attachments/802211985063542816/802568268807143454/10.gif", "https://media1.tenor.com/images/da8f0e8dd1a7f7db5298bda9cc648a9a/tenor.gif?itemid=12018819", "https://media1.tenor.com/images/f5176d4c5cbb776e85af5dcc5eea59be/tenor.gif?itemid=5081286	", "https://media1.tenor.com/images/6151c42c94df654b1c7de2fdebaa6bd1/tenor.gif?itemid=16456868", "https://media1.tenor.com/images/55df4c5fb33f3cd05b2f1ac417e050d9/tenor.gif?itemid=6238142", "https://media1.tenor.com/images/93ccdbf8da129c4fdf8a74a73fb34f17/tenor.gif?itemid=14809730", "https://media1.tenor.com/images/daa885ec8a9cfa4107eb966df05ba260/tenor.gif?itemid=13792462", "https://media1.tenor.com/images/2b3ddd79058842ccb9c1fc6acea0bcaa/tenor.gif?itemid=16243971", "https://media1.tenor.com/images/6ee188a109975a825f53e0dfa56d497d/tenor.gif?itemid=17747839", "https://media1.tenor.com/images/5466adf348239fba04c838639525c28a/tenor.gif?itemid=13284057", "https://media1.tenor.com/images/28f4f29de42f03f66fb17c5621e7bedf/tenor.gif?itemid=8659513"];
        var url = pat[Math.floor(Math.random() * pat.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('ff69b4')
        embed.setDescription(`**${user}** was patted by **${message.member}**`)
        embed.setImage(url)
        message.channel.send(embed)
    },
};