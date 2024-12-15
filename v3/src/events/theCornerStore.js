const { Event } = require('@foxxie/tails');
const { Timestamp } = require('foxxie');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'theCornerStore'
        })

        this.clockFormat = new Timestamp('HH:mm');
        this.timeStamp = new Timestamp('MMMM d YYYY');
        this.hourFormat = new Timestamp('H:mm a');
    }

    async welcome(member) {

        const { guild } = member;

        const embed = new MessageEmbed()
            .setColor(guild.me.displayColor)
            .setTitle('**Welcome to The Corner Store!**')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage(`https://cdn.discordapp.com/attachments/798807457391968270/798810208310788136/tenor-2.gif`)
            .setTimestamp()
            .setFooter([
                `Joined: ${this.timeStamp.display(member.joinedTimestamp)}, ${this.hourFormat.display(member.joinedTimestamp)}`,
                `Created: ${this.timeStamp.display(member.user.createdTimestamp)}, ${this.hourFormat.display(member.user.createdTimestamp)}`
            ].join('\n'), member.guild.iconURL({ dynamic: true }))
            .setDescription([
                `<:RuffTired:831894529262092298>┇Please read <#810039461306957876> to not be suprised by any punishments! If you'd like you could also select some <#836538674412912670> to let us get to know you.`,
                `<:RuffAngel:830699134331256863>┇First make an intro in <#795905444702322708> then start head to <#775306696658518027> or <#761518449172021268> to say hi. Wanna invite a friend? Use the command \`.inv\`.`,
                `<:RuffThink:855530424465620993>┇If you have any questions feel free to reach out to staff or other server members. We hope you enjoy our shop!`
            ].join('\n\n'))

        const channelId = await member.guild.settings.get('welcome.channel');
        if (!channelId) return member;
        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return member;

        const msg = await channel.send(`${member.toString()} **Just joined the server. <@&774173127717552139> be sure to welcome them. We now have ${member.guild.memberCount} member${member.guild.memberCount > 1 ? 's' : ''}!**`, { embed: embed });
        msg.delete({ timeout: 300000 }).catch(() => null);
    }

    clock() {
        const channel = this.client.channels.cache.get('821446943058296832');
        if (!channel) return;

        channel.setName(`🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${this.clockFormat.displayUTC(Date.now() - 25200000)}`).catch(() => null); 

        this.client.setInterval(() => {
            channel.setName(`🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${this.clockFormat.displayUTC(Date.now() - 25200000)}`).catch(() => null); 
        }, 600000)
        return;
    }

    memberCount(member) {
        const { guild } = member;
        const channel = guild.channels.cache.get('812226377717645332');
        channel.setName(`🥤 ┇𝐌𝐞𝐦𝐛𝐞𝐫𝐬・ ${guild.memberCount.toLocaleString()}`).catch(() => null);
        return member;
    }
}