import { AutomationCommand } from 'lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { aquireSettings, guildSettings } from 'lib/database';
import type { GuildMessage } from 'lib/types/Discord';
import { languageKeys } from 'lib/i18n';
import { toTitleCase } from '@ruffpuff/utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { resolveToNull } from 'lib/util';

@ApplyOptions<AutomationCommand.Options>({
    aliases: ['ws'],
    quotes: [],
    description: languageKeys.commands.settings.welcomeDescription,
    detailedDescription: languageKeys.commands.settings.welcomeExtendedUsage,
    options: ['timeout'],
    subCommands: ['channel', 'message', 'embed', { input: 'show', default: true }]
})
export class FoxxieAutomationCommand extends AutomationCommand {

    noSetChannelKey = languageKeys.commands.settings.welcomeChannelNoSet;
    setChannelKey = languageKeys.commands.settings.welcomeChannelSet;
    updateChannelKey = languageKeys.commands.settings.welcomeChannelUpdate;
    resetChannelKey = languageKeys.commands.settings.welcomeChannelReset;

    noSetMessageKey = languageKeys.commands.settings.welcomeMessageNoSet;
    setMessageKey = languageKeys.commands.settings.welcomeMessageSet;
    updateMessageKey = languageKeys.commands.settings.welcomeMessageUpdate;
    resetMessageKey = languageKeys.commands.settings.welcomeMessageReset;

    channelSettingKey = guildSettings.channels.welcome;
    embedSettingsKey = guildSettings.embeds.welcome;
    messageSettingsKey = guildSettings.messages.welcome;
    timeoutSettingKey = guildSettings.messages.welcomeAutoDelete;

    async show(msg: GuildMessage, args: AutomationCommand.Args): Promise<void> {
        const none = toTitleCase(args.t(languageKeys.globals.none));

        const [message, channelId, embed, timeout] = await aquireSettings(msg.guild, settings => {
            return [
                settings[guildSettings.messages.welcome],
                settings[guildSettings.channels.welcome],
                settings[guildSettings.embeds.welcome],
                settings[guildSettings.messages.welcomeAutoDelete]
            ];
        });

        const channel = await resolveToNull(msg.guild.channels.fetch(channelId));
        const content = args.t(languageKeys.commands.settings.welcomeShow, {
            message: message ? message.length > 30 ? `${message.substring(0, 30)}...` : message : none,
            channel: channel ? channel.name : none,
            embed: embed ? toTitleCase(args.t(languageKeys.globals.yes)) : toTitleCase(args.t(languageKeys.globals.no)),
            timeout: timeout ? args.t(languageKeys.globals.duration, { duration: Date.now() - timeout }) : none,
            joinArrays: '\n'
        });

        await send(msg, content);
    }

}