import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures/commands';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Message, Permissions } from 'discord.js';
import { GuildEntity, writeSettings, aquireSettings, guildSettings } from '../../lib/database';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['setprefix'],
    requiredUserPermissions: [Permissions.FLAGS.ADMINISTRATOR],
    description: languageKeys.commands.settings.prefixDescription,
    detailedDescription: languageKeys.commands.settings.prefixDetailedDescription
})
export default class extends FoxxieCommand {

    public async messageRun(message: Message, args: FoxxieCommand.Args): Promise<Message> {
        if (args.finished) return send(message, {
            content: args.t(languageKeys.commands.settings.prefixNow, { prefix: await aquireSettings(message.guild, guildSettings.prefix) })
        });

        const prefix = await args.pick('string', { minimum: 1, maximum: 10 });
        await writeSettings(message.guild, (settings: GuildEntity) => settings[guildSettings.prefix] = prefix);

        const content = args.t(languageKeys.commands.settings.prefixSet, { prefix });
        return send(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
    }

}