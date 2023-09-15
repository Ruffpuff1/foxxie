import { GuildSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { ModerationCommand, ModerationSetupRestriction } from '#lib/Structures';
import { ModerationRoleCommand } from '#lib/Structures/moderation/ModerationRoleCommand';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<ModerationRoleCommand.Options>({
    aliases: ['um'],
    duration: false,
    requiredClientPermissions: [PermissionFlagsBits.ManageRoles],
    memberOnly: true,
    options: ['reference'],
    description: LanguageKeys.Commands.Moderation.UnmuteDescription,
    successKey: LanguageKeys.Commands.Moderation.UnmuteSuccess,
    roleKey: GuildSettings.Roles.Muted,
    setUpKey: ModerationSetupRestriction.All
})
export class UserCommand extends ModerationRoleCommand {
    public async messagePrehandle(...[message, context]: ArgumentTypes<ModerationCommand['messagePrehandle']>) {
        await Promise.all(
            context.targets.map(
                user => this.container.redis?.pinsertex(`guild:${message.guild.id}:unmute:${user.id}`, seconds(20), '')
            )
        );
    }

    public async messageHandle(...[message, context]: ArgumentTypes<ModerationCommand['messageHandle']>) {
        return this.container.utilities.guild(message.guild).moderation.actions.unmute(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                reason: context.reason,
                channelId: message.channel.id,
                guildId: message.guild.id,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            await this.messageGetDmData(message, context)
        );
    }

    public async chatInputHandle(...[interaction, context]: ArgumentTypes<ModerationCommand['chatInputHandle']>) {
        const reference = interaction.options.getNumber('reference');

        return this.container.utilities.guild(interaction.guild).moderation.actions.unmute(
            {
                userId: context.target.id,
                moderatorId: interaction.user.id,
                reason: context.reason,
                channelId: interaction.channelId,
                guildId: interaction.guild.id,
                refrence: reference ? Number(reference) : null
            },
            await this.chatInputGetDmData(interaction)
        );
    }
}
