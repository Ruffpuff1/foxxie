import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/structures';
import { getModeration } from '#utils/Discord';
import { resolveKey } from '#utils/util';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { fromAsync } from '@sapphire/framework';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['ub'],
    description: LanguageKeys.Commands.Moderation.UnbanDescription,
    duration: false,
    requiredClientPermissions: [PermissionFlagsBits.BanMembers],
    memberOnly: false,
    options: ['reference'],
    successKey: LanguageKeys.Commands.Moderation.UnbanSuccess
})
export class UserCommand extends ModerationCommand {
    public async prehandle(...[message, context]: ArgumentTypes<ModerationCommand['prehandle']>) {
        const result = await fromAsync(message.guild.bans.fetch());
        const bans = result.success ? result.value.map(ban => ban.user.id) : null;

        if (bans === null) {
            throw await resolveKey(message, LanguageKeys.System.FetchBansFail);
        }

        if (bans.length === 0) {
            throw await resolveKey(message, LanguageKeys.Commands.Moderation.GuildBansEmpty);
        }

        await Promise.all(
            context.targets.map(
                user => this.container.redis?.pinsertex(`guild:${message.guild.id}:unban:${user.id}`, seconds(20), '')
            )
        );

        return { bans };
    }

    public async handle(...[message, context]: ArgumentTypes<ModerationCommand['handle']>) {
        return getModeration(message.guild).actions.unban(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                duration: context.duration,
                reason: context.reason,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            await this.getDmData(message, context)
        );
    }

    public async checkModeratable(
        ...[message, context]: ArgumentTypes<ModerationCommand<{ bans: string[] }>['checkModeratable']>
    ) {
        if (!context.preHandled.bans.includes(context.target.id))
            throw context.args.t(LanguageKeys.Commands.Moderation.GuildBansNotFound);
        return super.checkModeratable(message, context);
    }
}
