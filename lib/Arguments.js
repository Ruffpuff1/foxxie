class Argument {
    
    constructor(message) {
        this.message = message;
        this.guild = message.guild;
    }

    members (arg) {

        const rgx = /^<@!?(812546582531801118|825130284382289920)>/gm;

        let members = [];
        const match = (this.message.content.replace(rgx, '')).match(/<@!?(\d{17,19})>/g);

        if (!match || !match.length) return null;
        match.forEach(m => {
            const member = this.message.guild.members.cache.get(m.replace(/(<|>|@|!)/gi, ''));
            members.push(member)
        })

        return members;
    }

    memberIds(arg) {

        const rgx = /^<@!?(812546582531801118|825130284382289920)>/gm;
        let members = [];
        const match = (this.message.content.replace(rgx, '')).match(/\d{17,19}/g);

        if (!match || !match.length) return null;
        match.forEach(m => {
            const member = this.message.guild.members.cache.get(m);
            members.push(member)
        })

        return members;

    }
}

module.exports = Argument