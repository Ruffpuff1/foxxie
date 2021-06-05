const { MessageEmbed } = require("discord.js");

class RoleplayCommand {
    
    constructor(message){
        this.message = message
    }

    async execute(act, args, self){

        const gifs = await this.message.client.settings.get(`gifs.roleplay`);
        const language = this.message.language;
        const description = []
        const embed = new MessageEmbed()
            .setColor(this.message.guild.me.displayColor)
            .setImage(gifs[act][Math.floor(Math.random() * gifs[act].length)])

        const membersArr = this.message.args.members() || this.message.args.memberIds();
        const membersFirst = membersArr ? membersArr[0] : null;
        const membersLast = membersArr ? membersArr[membersArr.length -1] : null;

        if (membersArr && membersArr.length > 1) {
            description.push(language.get(`COMMAND_${act.toUpperCase()}_MULTIPLE`, this.message.member.displayName, membersArr.slice(0, -1).map(m => m.displayName).join(", ") + `** and **${membersLast.displayName}`));
            let text = args.slice(membersArr.length).join(' ');
            if (text) description.push(`"${text}"`);

            membersArr.forEach(async mem => await mem.user.settings.inc(`roleplayStats.${act}.recieved`));
            await this.message.author.settings.inc(`roleplayStats.${act}.given`);
            let countTar = await membersFirst.user.settings.get(`roleplayStats.${act}`);
            let countAuth = await this.message.author.settings.get(`roleplayStats.${act}`);
            let tarRecieved = countTar ? countTar.recieved ? countTar.recieved : 0 : 0;
            let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;

            embed
                .setFooter(language.get(`COMMAND_${act.toUpperCase()}_FOOTER`, this.message.member.displayName, membersFirst.displayName, authorGiven.toLocaleString(), tarRecieved.toLocaleString()));

            embed.setDescription(description.join('\n'))
            return this.message.channel.send(embed)
        }

        let target = membersFirst || this.message.guild.members.cache.get(args[0]) || this.message.guild.members.cache.find(m => m.displayName.toLowerCase() === args[0]?.toLowerCase()) || this.message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0]?.toLowerCase());

if (target) {
            description.push(language.get(`COMMAND_${act.toUpperCase()}_SINGLE`, this.message.member.displayName, target.displayName));
            let text = args.slice(1).join(' ');
            if (text) description.push(`"${text}"`);
            await this.message.author.settings.inc(`roleplayStats.${act}.given`)
            await target.user.settings.inc(`roleplayStats.${act}.recieved`)

            let countAuth = await this.message.author.settings.get(`roleplayStats.${act}`);
            let countTar = await target.user.settings.get(`roleplayStats.${act}`);
            let tarRecieved = countTar ? countTar.recieved ? countTar.recieved : 0 : 0;
            let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;
            embed
                .setFooter(language.get(`COMMAND_${act.toUpperCase()}_FOOTER`, this.message.member.displayName, target.displayName, authorGiven.toLocaleString(), tarRecieved.toLocaleString()));


            embed.setDescription(description.join('\n'))
            return this.message.channel.send(embed)
        }

        if (/(me|myself|mi|self)/i.test(args[0])) {
            description.push(language.get(`COMMAND_${act.toUpperCase()}_SINGLE`, this.message.guild.me.displayName, this.message.member.displayName))
            await this.message.client.user.settings.inc(`roleplayStats.${act}.given`)
            await this.message.author.settings.inc(`roleplayStats.${act}.recieved`)

            let countAuth = await this.message.client.user.settings.get(`roleplayStats.${act}`);
            let countTar = await this.message.author.settings.get(`roleplayStats.${act}`);
            let tarRecieved = countTar ? countTar.recieved ? countTar.recieved : 0 : 0;
            let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;

            embed
                .setFooter(language.get(`COMMAND_${act.toUpperCase()}_FOOTER`, this.message.guild.me.displayName, this.message.member.displayName, authorGiven.toLocaleString(), tarRecieved.toLocaleString()));

            embed.setDescription(description.join('\n'))
            return this.message.channel.send(embed)
        }

        if (!target && !self) return this.message.responder.error('COMMAND_ROLEPLAY_NO_MEMBER', act);

        if (!target && self) {
            description.push(`**${this.message.member.displayName}** ${language.get(`COMMAND_${act.toUpperCase()}_SELF`)}`)
            let text = args.slice(0).join(' ');
            if (text) description.push(`"${text}"`);
            let countAuth = await this.message.author.settings.get(`roleplayStats.${act}`);
            let authorGiven = countAuth ? countAuth.given ? countAuth.given : 0 : 0;

        
            embed.setDescription(description.join('\n'))
                .setFooter(`${this.message.member.displayName} has ${act === 'sleep' ? 'slept' : `${act}ed`} ${authorGiven} times`)
            return this.message.channel.send(embed)
        }
    }
}

module.exports = RoleplayCommand