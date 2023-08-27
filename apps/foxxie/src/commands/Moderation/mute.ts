import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand, ModerationSetupRestriction } from '#lib/structures';
import { ModerationRoleCommand } from '#lib/structures/moderation/ModerationRoleCommand';
import { getModeration } from '#utils/Discord';
import { seconds } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<ModerationRoleCommand.Options>({
    aliases: ['m'],
    duration: true,
    requiredClientPermissions: [PermissionFlagsBits.ManageRoles],
    memberOnly: true,
    options: ['reference'],
    detailedDescription: LanguageKeys.Commands.Moderation.MuteDetailedDescription,
    successKey: LanguageKeys.Commands.Moderation.MuteSuccess,
    roleKey: GuildSettings.Roles.Muted,
    setUpKey: ModerationSetupRestriction.All
})
export class UserCommand extends ModerationRoleCommand {
    public async prehandle(...[message, context]: ArgumentTypes<ModerationCommand['prehandle']>) {
        await Promise.all(
            context.targets.map(
                user => this.container.redis?.pinsertex(`guild:${message.guild.id}:mute:${user.id}`, seconds(20), '')
            )
        );
        return;
    }

    public async handle(...[message, context]: ArgumentTypes<ModerationCommand['handle']>) {
        return getModeration(message.guild).actions.mute(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                reason: context.reason,
                channelId: message.channel.id,
                guildId: message.guild.id,
                duration: context.duration,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            await this.getDmData(message, context)
        );
    }
}
