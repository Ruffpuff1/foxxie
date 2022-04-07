import { Guild, Message, Permissions } from 'discord.js';
import { FoxxieCommand } from '../../lib/structures';
import { send } from '@sapphire/plugin-editable-commands';
import { events, getModeration, sendLoading } from '../../lib/util';
import type { ModerationEntity } from '../../lib/database';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';
import type { GuildMessage } from '../../lib/types/Discord';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['res'],
    description: languageKeys.commands.moderation.reasonDescription,
    detailedDescription: languageKeys.commands.moderation.reasonExtendedUsage,
    requiredUserPermissions: [Permissions.FLAGS.MANAGE_MESSAGES]
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const caseId = await args.pick('moderationEntry');

        const log = await getModeration(msg.guild as Guild).fetch(caseId) as ModerationEntity;
        if (!log) this.error(languageKeys.commands.moderation.caseNoExist, { caseId });

        const reason = await args.rest('string', { maximum: 1000 });
        const loading = await sendLoading(msg);

        const clone = log.clone();
        log.reason = reason;
        await log.save();
        await this.container.client.emit(events.MODERATION_ENTRY_EDIT, clone, log);

        await send(msg, args.t(languageKeys.commands.moderation.reasonSuccess, { id: log.caseId, reason }));
        return loading.delete();
    }

}