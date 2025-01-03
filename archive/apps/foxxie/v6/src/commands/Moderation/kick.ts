import { LanguageKeys } from '#lib/i18n';
import { ModerationCommand } from '#lib/structures';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { ArgumentTypes } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['k'],
    description: LanguageKeys.Commands.Moderation.KickDescription,
    duration: false,
    requiredClientPermissions: [PermissionFlagsBits.KickMembers],
    memberOnly: false,
    options: ['refrence'],
    successKey: LanguageKeys.Commands.Moderation.KickSuccess
})
export class UserCommand extends ModerationCommand {
    public async handle(...[message, context]: ArgumentTypes<ModerationCommand['handle']>) {
        return getModeration(message.guild).actions.kick(
            {
                userId: context.target.id,
                moderatorId: message.author.id,
                duration: context.duration,
                reason: context.reason,
                refrence: context.args.getOption('refrence') ? Number(context.args.getOption('refrence')) : null
            },
            await this.getDmData(message, context)
        );
    }

    public async checkModeratable(
        ...[message, context]: ArgumentTypes<ModerationCommand<{ bans: string[] }>['checkModeratable']>
    ) {
        const member = await super.checkModeratable(message, context);
        if (member && !member.kickable) throw 'listeners/errors:moderationKickable';
        return member;
    }
}
