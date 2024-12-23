/*
 * Co-Authored by Ruff (http://ruff.cafe)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 */
const { ReactionCollector } = require('discord.js');
const { noop } = require('../util/constants');

module.exports = class GuildReactionCollector extends ReactionCollector {

    constructor(...args) {
        super(...args);

        this._handlerMessageDeletion = noop;

        this._handleChannelDeletion = noop;
    }

    collect(reaction) {
        if (reaction.message.guild.id !== this.message.guild.id) return null;
        return ReactionCollector.key(reaction);
    }

    dispose(reaction, user) {
        if (reaction.message.guild.id !== this.message.guild.id) return null;
        if (this.collected.has(ReactionCollector.key(reaction)) && this.users.has(user.id)) {
            this.emit('remove', reaction, user);
        }
        return reaction.count ? null : ReactionCollector.key(reaction);
    }
}