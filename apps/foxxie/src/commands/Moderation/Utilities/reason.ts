import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { FoxxieEvents, GuildMessage, PermissionLevels } from '#lib/Types';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<FoxxieCommand.Options>({
    permissionLevel: PermissionLevels.Moderator,
    description: LanguageKeys.Commands.Moderation.ReasonDescription,
    usage: LanguageKeys.Commands.Moderation.ReasonUsage
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const caseId = await args.pick('moderationLog');

        const log = await this.container.utilities.guild(message.guild).moderation.fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { id: caseId });

        const reason = await args.rest('string', { maximum: 200 });
        const clone = log.clone();

        clone.reason = reason;

        this.client.emit(FoxxieEvents.ModerationEntryEdit, log, clone);

        log.reason = reason;
        await log.save();

        await send(message, args.t(LanguageKeys.Commands.Moderation.ReasonSuccess, { reason }));
    }
}
