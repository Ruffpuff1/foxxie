import type { GuildMessage } from '../../lib/types/Discord';
import { FoxxieCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, Permissions } from 'discord.js';
import { guildSettings, aquireSettings, writeSettings } from '../../lib/database';
import { send } from '@sapphire/plugin-editable-commands';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['mmsg'],
    generateDashLessAliases: true,
    requiredUserPermissions: Permissions.FLAGS.ADMINISTRATOR,
    description: languageKeys.commands.moderation.modmessageDescription,
    detailedDescription: languageKeys.commands.moderation.modmessageExtendedUsage
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const bool = await args.pick('boolean').catch(() => null);

        if (bool === null) {
            const enabled = <boolean>await aquireSettings(msg.guild, guildSettings.messages.moderationAutoDelete);

            const content = args.t(languageKeys.commands.moderation[`modmessage${enabled ? 'Enabled' : 'Disabled'}`]);
            return send(msg, content);
        }

        await writeSettings(msg.guild, settings => settings[guildSettings.messages.moderationAutoDelete] = bool);
        return send(msg, args.t(languageKeys.commands.moderation.modmessageToggled));
    }

}