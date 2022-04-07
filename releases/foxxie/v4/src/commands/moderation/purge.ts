import { PermissionFlagsBits } from 'discord-api-types/v9';
import { FoxxieCommand } from 'lib/structures';
import { getModeration, sendTemporaryMessage } from 'lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import type { GuildMessage } from 'lib/types/Discord';
import type { Collection, Message, User } from 'discord.js';
import { languageKeys } from 'lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['p', 'prune'],
    description: languageKeys.commands.moderation.purgeDescription,
    detailedDescription: languageKeys.commands.moderation.purgeExtendedUsage,
    requiredClientPermissions: PermissionFlagsBits.ManageMessages,
    requiredUserPermissions: PermissionFlagsBits.ManageMessages,
    flags: ['p', 'pins', 'pinned']
})
export class UserCommand extends FoxxieCommand {

    public inviteRegex = /(?<proto>https?:\/\/)?(.*?@)?(www\.)?(?<source>(discord|invite)\.(?:gg|io|me|plus|link)|invite\.(?:gg|ink)|discord(?:app)?\.com\/invite)\/(?<code>[\w-]{2,})/gi;

    async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        let limit = await args.pick('integer', { minimum: 1, maximum: 100 });
        const filter = await args.pick(UserCommand.filter).catch(() => null);
        const user = filter === PurgeFilter.User && !args.finished ? await args.pick('user') : null;
        const reason = args.finished ? null : await args.rest('string');

        let messages: Collection<string, Message> | string[] = await msg.channel.messages.fetch({ limit: 100 });
        messages = this.filterMessages(messages, filter, user, msg);
        if (!args.getFlags('p', 'pins', 'pinned')) messages = messages.filter(mes => !mes.pinned);

        if (messages.has(msg.id)) limit++;
        messages = [...messages.keys()].slice(0, limit);
        if (!messages.includes(msg.id)) messages.push(msg.id);

        await getModeration(msg.guild).actions.prune(
            {
                channelId: msg.channel.id,
                moderatorId: msg.author.id,
                reason,
                userId: user ? user.id : null,
                extraData: {
                    total: messages.length - 1
                }
            },
            {
                msg,
                messages
            }
        );
        await sendTemporaryMessage(msg, args.t(languageKeys.commands.moderation.purgeSuccess, { count: messages.length - 1 }));
    }

    filterMessages(messages: Collection<string, Message>, filter: PurgeFilter | null, user: User | null, msg: GuildMessage): Collection<string, Message> {
        if (filter) messages = messages.filter(this.getFilter(msg, filter, user));
        return messages;
    }

    getFilter(msg: GuildMessage, filter: PurgeFilter, user: User): (mes: Message) => boolean {
        switch (filter) {
        case PurgeFilter.Link: return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
        case PurgeFilter.Invite: return mes => this.inviteRegex.test(mes.content);
        case PurgeFilter.Bots: return mes => mes.author.bot;
        case PurgeFilter.You: return mes => mes.author.id === msg.client.user.id;
        case PurgeFilter.Me: return mes => mes.author.id === msg.author.id;
        case PurgeFilter.Upload: return mes => mes.attachments.size > 0;
        case PurgeFilter.Text: return mes => mes.attachments.size === 0;
        case PurgeFilter.User: return mes => mes.author.id === user.id;
        default: return () => true;
        }
    }

    static filter = Args.make<PurgeFilter | null>(parameter => {
        switch (parameter) {
        case PurgeFilter.Link:
            return Args.ok(PurgeFilter.Link);
        case PurgeFilter.Invite:
            return Args.ok(PurgeFilter.Invite);
        case PurgeFilter.Bots:
            return Args.ok(PurgeFilter.Bots);
        case PurgeFilter.You:
            return Args.ok(PurgeFilter.You);
        case PurgeFilter.Me:
            return Args.ok(PurgeFilter.Me);
        case PurgeFilter.Upload:
            return Args.ok(PurgeFilter.Upload);
        case PurgeFilter.Text:
            return Args.ok(PurgeFilter.Text);
        case PurgeFilter.User:
            return Args.ok(PurgeFilter.User);
        default:
            return Args.ok(null);
        }
    });

}

const enum PurgeFilter {
    Link = 'link',
    Invite = 'invite',
    Bots = 'bots',
    You = 'you',
    Me = 'me',
    Upload = 'upload',
    User = 'user',
    Text = 'text'
}