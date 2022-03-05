import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GatewayDispatchEvents, GatewayMessageReactionAddDispatch, APIEmoji } from 'discord-api-types/v9';
import type { Guild } from 'discord.js';
import { floatPromise } from '#utils/util';
import { acquireSettings, GuildSettings } from '#lib/database';
import { isDev, resolveToNull } from '@ruffpuff/utilities';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: GatewayDispatchEvents.MessageReactionAdd,
    emitter: 'ws'
})
export class UserListener extends Listener {
    public async run({ user_id: userId, guild_id: guildId, message_id: messageId, emoji }: GatewayMessageReactionAddDispatch['d']): Promise<void> {
        const guild = this.container.client.guilds.cache.get(guildId!);
        if (!guild) return;

        await this.runReactionRole(userId, messageId, guild, emoji);
    }

    private async runReactionRole(userId: string, messageId: string, guild: Guild, emoji: APIEmoji): Promise<boolean> {
        const reactionRoles = await acquireSettings(guild, GuildSettings.Roles.Reaction);
        if (!reactionRoles.length) return false;

        const member = await resolveToNull(guild.members.fetch(userId));

        const added = reactionRoles.find(async reactionRole => {
            const decodedEmoji = reactionRole.emoji.includes('%') ? decodeURIComponent(reactionRole.emoji) : reactionRole.emoji;

            if (reactionRole.messageId === messageId && (decodedEmoji === emoji.id || decodedEmoji === emoji.name)) {
                if (!member || member.user.bot) return false;

                const role = guild.roles.cache.get(reactionRole.roleId);
                if (!role) return false;

                await floatPromise(member.roles.add(role));
                return true;
            }
            return false;
        });

        return Boolean(added);
    }
}
