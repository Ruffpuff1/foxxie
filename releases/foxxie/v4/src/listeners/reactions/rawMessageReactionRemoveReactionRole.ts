import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayMessageReactionRemoveDispatch, APIEmoji } from 'discord-api-types/v9';
import type { Guild } from 'discord.js';
import { floatPromise, isOnServer } from '../../lib/util';
import { ReactionRole, aquireSettings, guildSettings } from '../../lib/database';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer(),
    event: GatewayDispatchEvents.MessageReactionRemove,
    emitter: 'ws'
})
export class UserListener extends Listener {

    public run({ user_id: userId, guild_id: guildId, message_id: messageId, emoji }: GatewayMessageReactionRemoveDispatch['d']): void {
        const guild = this.container.client.guilds.cache.get(guildId as string);
        if (!guild) return;

        this.runReactionRole(userId, messageId, guild, emoji);
    }

    private async runReactionRole(userId: string, messageId: string, guild: Guild, emoji: APIEmoji): Promise<boolean> {
        const reactionRoles = await aquireSettings(guild, guildSettings.roles.reaction) as ReactionRole[];
        if (!reactionRoles.length) return false;

        await floatPromise(guild.members.fetch(userId));

        const added = reactionRoles.find(reactionRole => {
            const decodedEmoji = reactionRole.emoji.includes('%')
                ? decodeURIComponent(reactionRole.emoji)
                : reactionRole.emoji;

            if (reactionRole.messageId === messageId && (decodedEmoji === emoji.id || decodedEmoji === emoji.name)) {
                const member = guild.members.cache.get(userId);
                if (!member || member.user.bot) return false;

                const role = guild.roles.cache.get(reactionRole.roleId);
                if (!role) return false;

                floatPromise(member.roles.remove(role));
                return true;
            }
            return false;
        });

        return Boolean(added);
    }

}