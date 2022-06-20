import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand, SettingsMenu } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { PermissionFlagsBits } from 'discord-api-types/v10';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['config', 'settings'],
    description: LanguageKeys.Commands.Configuration.ConfDescription,
    usage: LanguageKeys.Commands.Configuration.ConfUsage,
    subCommands: [{ input: 'menu', default: true }]
})
export default class UserCommand extends FoxxieCommand {
    @RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.AddReactions])
    public menu(message: GuildMessage, args: FoxxieCommand.Args, context: FoxxieCommand.Context) {
        return new SettingsMenu(message, args.t).init(context);
    }
}
