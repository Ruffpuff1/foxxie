class Argument {
    
    constructor(message) {
        this.message = message;
        this.guild = message.guild;
    }

    members () {

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

    users () {

        const rgx = /^<@!?(812546582531801118|825130284382289920)>/gm;

        let users = [];
        const match = (this.message.content.replace(rgx, '')).match(/<@!?(\d{17,19})>/g);

        // if (!match || !match.length) return null;
        match?.forEach(m => {
            const user = this.message.client.users.cache.get(m.replace(/(<|>|@|!)/gi, ''));
            users.push(user)
        })

        const ids = this.userIds();
        if (!match || !ids) return null;
        users = ids.concat(users);

        return users;
    }

    memberIds() {

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

    userIds() {

        const rgx = /^<@!?(812546582531801118|825130284382289920)>/gm;
        let users = [];
        const match = (this.message.content.replace(rgx, '')).match(/\d{17,19}/g);

        if (!match || !match.length) return null;
        match.forEach(m => {
            const user = this.message.client.users.cache.get(m);
            users.push(user)
        })

        return users;
    }
}

module.exports = Argument