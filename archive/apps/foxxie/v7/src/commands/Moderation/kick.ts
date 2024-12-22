import { LanguageKeys } from '#lib/I18n';
import { ModerationCommand } from '#lib/Structures';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['k'],
    detailedDescription: LanguageKeys.Commands.Moderation.KickDetailedDescription,
    duration: false,
    requiredClientPermissions: [PermissionFlagsBits.KickMembers],
    memberOnly: false,
    options: ['reference'],
    successKey: LanguageKeys.Commands.Moderation.KickSuccess
})
export class UserCommand extends ModerationCommand {
    public async messagePrehandle(...[message, context]: ArgumentTypes<ModerationCommand['messagePrehandle']>) {
        await Promise.all(
            context.targets.map(
                user => this.container.redis?.pinsertex(`guild:${message.guild.id}:kick:${user.id}`, seconds(20), '')
            )
        );
    }

    public async messageHandle(...[message, context]: ArgumentTypes<ModerationCommand['messageHandle']>) {
        return this.container.utilities.guild(message.guild).moderation.actions.kick(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                channelId: message.channel.id,
                duration: context.duration,
                reason: context.reason,
                guildId: message.guild.id,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            await this.messageGetDmData(message, context)
        );
    }

    public async checkModeratable(
        ...[message, context]: ArgumentTypes<ModerationCommand<{ bans: string[] }>['messageCheckModeratable']>
    ) {
        const member = await super.messageCheckModeratable(message, context);
        if (member && !member.kickable) throw LanguageKeys.Listeners.Errors.ModerationKickable;
        return member;
    }

    public async chatInputPrehandle(...[interaction, context]: ArgumentTypes<ModerationCommand['chatInputPrehandle']>) {
        await Promise.all(
            context.targets.map(
                user => this.container.redis?.pinsertex(`guild:${interaction.guild.id}:kick:${user.id}`, seconds(20), '')
            )
        );
    }

    public async chatInputHandle(...[interaction, context]: ArgumentTypes<ModerationCommand['chatInputHandle']>) {
        const reference = interaction.options.getNumber('reference');

        return this.container.utilities.guild(interaction.guild).moderation.actions.kick(
            {
                userId: context.target.id,
                moderatorId: interaction.user.id,
                channelId: interaction.channelId,
                duration: context.duration,
                reason: context.reason,
                guildId: interaction.guild.id,
                refrence: reference ? Number(reference) : null
            },
            await this.chatInputGetDmData(interaction)
        );
    }

    public async messageCheckModeratable(
        ...[message, context]: ArgumentTypes<ModerationCommand<{ bans: string[] }>['messageCheckModeratable']>
    ) {
        const member = await super.messageCheckModeratable(message, context);
        if (member && !member.kickable) throw LanguageKeys.Listeners.Errors.ModerationKickable;
        return member;
    }

    public async chatInputCheckModeratable(
        ...[interaction, context]: ArgumentTypes<ModerationCommand<{ bans: string[] }>['chatInputCheckModeratable']>
    ) {
        const member = await super.chatInputCheckModeratable(interaction, context);
        if (member && !member.kickable) throw LanguageKeys.Listeners.Errors.ModerationKickable;
        return member;
    }
}
