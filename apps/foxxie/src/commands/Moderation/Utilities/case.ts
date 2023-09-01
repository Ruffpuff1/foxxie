import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['modlog'],
    description: LanguageKeys.Commands.Moderation.CaseDescription,
    usage: LanguageKeys.Commands.Moderation.CaseUsage,
    permissionLevel: PermissionLevels.Moderator,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const caseId = await args.pick('moderationLog');

        const log = await getModeration(message.guild).fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { id: caseId });

        const embed = await log.prepareEmbed();
        await send(message, { embeds: [embed], content: null });
    }
}
