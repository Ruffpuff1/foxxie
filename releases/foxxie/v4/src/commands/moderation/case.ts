import { Message, Permissions } from 'discord.js';
import { FoxxieCommand } from '../../lib/structures';
import { send } from '@sapphire/plugin-editable-commands';
import { getModeration } from '../../lib/util';
import type { ModerationEntity } from '../../lib/database';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['entry'],
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS],
    requiredUserPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    description: languageKeys.commands.moderation.caseDescription,
    detailedDescription: languageKeys.commands.moderation.caseExtendedUsage
})
export default class extends FoxxieCommand {

    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const caseId = await args.pick('moderationEntry');

        const log = await getModeration(msg.guild).fetch(caseId) as ModerationEntity;
        if (!log) this.error(languageKeys.commands.moderation.caseNoExist, { caseId });

        const embed = await log.prepareEmbed();
        return send(msg, { embeds: [embed] });
    }

}