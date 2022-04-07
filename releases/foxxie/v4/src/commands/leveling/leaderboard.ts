import { Permissions } from 'discord.js';
import { FoxxieCommand } from '../../lib/structures';
import { Leaderboard, LbKeyMatch, hours, sendLoading } from '../../lib/util';
import { send } from '@sapphire/plugin-editable-commands';
import type { GuildMessage } from '../../lib/types/Discord';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['lb'],
    description: languageKeys.commands.leveling.leaderboardDescription,
    detailedDescription: languageKeys.commands.leveling.leaderboardExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS],
    subCommands: ['messages', { input: 'level', default: true }]
})
export default class extends FoxxieCommand {

    public levelCache = new Map<string, Leaderboard>();
    public msgCache = new Map<string, Leaderboard>();

    async level(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);

        if (!this.levelCache.has(msg.guild.id)) await this.create(this.levelCache, 'points', 20, msg);

        const board = this.levelCache.get(msg.guild.id);
        return this.buildAndSend(msg, loading, board, 'level', args.t);
    }

    async messages(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);

        if (!this.msgCache.has(msg.guild.id)) await this.create(this.msgCache, 'messageCount', 20, msg);

        const board = this.msgCache.get(msg.guild.id);
        return this.buildAndSend(msg, loading, board, 'messages', args.t);
    }

    private async buildAndSend(msg: GuildMessage, loading: Message, board: Leaderboard | undefined, key: string, t: TFunction): Promise<Message> {
        if (!board?.mapped?.length) return this.handleNone(msg, loading, key, t);
        const embed = await board.buildEmbed(msg, key);

        await send(msg, { embeds: [embed] });
        return loading.delete();
    }

    private async create(cache: Map<string, Leaderboard>, key: LbKeyMatch, limit: number, msg: GuildMessage): Promise<void> {
        const leaderboard = await new Leaderboard(msg.guild, key).setup(limit);
        cache.set(msg.guild.id, leaderboard);
        setTimeout(() => cache.delete(msg.guild.id), hours(2));
    }

    private async handleNone(msg: GuildMessage, loading: Message, type: string, t: TFunction): Promise<Message> {
        await send(msg, t(languageKeys.commands.leveling.leaderboardNoData, { context: type }));
        return loading.delete();
    }

}