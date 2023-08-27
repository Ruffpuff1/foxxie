import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { Events, GuildMessage, PermissionLevels } from '#lib/types';
import { getModeration } from '#utils/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<FoxxieCommand.Options>({
    permissionLevel: PermissionLevels.Moderator,
    description: LanguageKeys.Commands.Moderation.ReasonDescription,
    usage: LanguageKeys.Commands.Moderation.ReasonUsage
})
export default class UserCommand extends FoxxieCommand {
    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args) {
        const caseId = await args.pick('moderationLog');

        const log = await getModeration(message.guild).fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { id: caseId });

        const reason = await args.rest('string', { maximum: 200 });
        const clone = log.clone();

        clone.reason = reason;

        this.client.emit(Events.ModerationEntryEdit, log, clone);

        log.reason = reason;
        await log.save();

        return send(message, args.t(LanguageKeys.Commands.Moderation.ReasonSuccess, { reason }));
    }
}
