import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand, ModerationSetupRestriction } from '#lib/structures';
import { ModerationRoleCommand } from '#lib/structures/moderation/ModerationRoleCommand';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<ModerationRoleCommand.Options>({
    aliases: ['m'],
    duration: true,
    requiredClientPermissions: [PermissionFlagsBits.ManageRoles],
    memberOnly: true,
    options: ['reference'],
    description: LanguageKeys.Commands.Moderation.MuteDescription,
    successKey: LanguageKeys.Commands.Moderation.MuteSuccess,
    roleKey: GuildSettings.Roles.Muted,
    setUpKey: ModerationSetupRestriction.All
})
export class UserCommand extends ModerationRoleCommand {
    public async handle(...[message, context]: ArgumentTypes<ModerationCommand['handle']>) {
        return getModeration(message.guild).actions.mute(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                reason: context.reason,
                guildId: message.guild.id,
                duration: context.duration,
                refrence: context.args.getOption('reference') ? Number(context.args.getOption('reference')) : null
            },
            await this.getDmData(message, context)
        );
    }
}
