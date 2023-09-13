import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/structures';
import { getModeration } from '#utils/Discord';
import { resolveKey } from '#utils/util';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Result } from '@sapphire/result';
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
    public async messagePrehandle(...[message, context]: ArgumentTypes<ModerationCommand['messagePrehandle']>) {
        const result = await Result.fromAsync(message.guild.bans.fetch());
        const bans = result.isOk() ? result.unwrap().map(ban => ban.user.id) : null;

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

    public async messageHandle(...[message, context]: ArgumentTypes<ModerationCommand['messageHandle']>) {
        return getModeration(message.guild).actions.unban(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                duration: context.duration,
                channelId: message.channel.id,
                reason: context.reason,
                guildId: message.guild.id,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            await this.messageGetDmData(message, context)
        );
    }

    public async messageCheckModeratable(
        ...[message, context]: ArgumentTypes<ModerationCommand<{ bans: string[] }>['messageCheckModeratable']>
    ) {
        if (!context.preHandled.bans.includes(context.target.id))
            throw context.args.t(LanguageKeys.Commands.Moderation.GuildBansNotFound);
        return super.messageCheckModeratable(message, context);
    }

    public async chatInputPrehandle(...[interaction, context]: ArgumentTypes<ModerationCommand['chatInputPrehandle']>) {
        const result = await Result.fromAsync(interaction.guild.bans.fetch());
        const bans = result.isOk() ? result.unwrap().map(ban => ban.user.id) : null;

        if (bans === null) {
            throw await resolveKey(interaction, LanguageKeys.System.FetchBansFail);
        }

        if (bans.length === 0) {
            throw await resolveKey(interaction, LanguageKeys.Commands.Moderation.GuildBansEmpty);
        }

        await Promise.all(
            context.targets.map(
                user => this.container.redis?.pinsertex(`guild:${interaction.guild.id}:unban:${user.id}`, seconds(20), '')
            )
        );

        return { bans };
    }

    public async chatInputHandle(...[interaction, context]: ArgumentTypes<ModerationCommand['chatInputHandle']>) {
        const reference = interaction.options.getNumber('reference');

        return getModeration(interaction.guild).actions.unban(
            {
                userId: context.target.id,
                moderatorId: interaction.user.id,
                duration: context.duration,
                channelId: interaction.channelId,
                reason: context.reason,
                guildId: interaction.guild.id,
                refrence: reference ? Number(reference) : null
            },
            await this.chatInputGetDmData(interaction)
        );
    }

    public async chatInputCheckModeratable(
        ...[interaction, context]: ArgumentTypes<ModerationCommand<{ bans: string[] }>['chatInputCheckModeratable']>
    ) {
        if (!context.preHandled.bans.includes(context.target.id))
            throw context.t(LanguageKeys.Commands.Moderation.GuildBansNotFound);
        return super.chatInputCheckModeratable(interaction, context);
    }
}
