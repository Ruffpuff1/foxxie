import { FoxxieCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { getModeration } from '#utils/Discord';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['entry'],
    permissionLevel: PermissionLevels.Moderator,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    description: LanguageKeys.Commands.Moderation.CaseDescription,
    detailedDescription: LanguageKeys.Commands.Moderation.CaseDetailedDescription
})
export class UserCommand extends FoxxieCommand {
    public registerApplicationCommands(...[registry]: Parameters<FoxxieCommand['registerApplicationCommands']>) {
        registry //
            .registerChatInputCommand(
                builder =>
                    builder //
                        .setName(this.name) //
                        .setDescription(this.container.i18n.format('en-US', this.description)) //
                        .addIntegerOption(option =>
                            option //
                                .setName('caseid') //
                                .setDescription('The id of the case to display.') //
                                .setRequired(true)
                        )
                        .addBooleanOption(option =>
                            option //
                                .setName('ephemeral') //
                                .setDescription('Whether the case should be sent ephemerally.')
                                .setRequired(false)
                        ),
                {
                    guildIds: ['826893949880631376']
                }
            );
    }

    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const caseId = await args.pick('moderationEntry');

        const log = await getModeration(msg.guild).fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { caseId });

        const embed = await log.prepareEmbed();
        return send(msg, { embeds: [embed] });
    }

    public async chatInputRun(...[interaction, _, args]: Parameters<FoxxieCommand<CaseCommandArgs>['chatInputRun']>) {
        const caseId = args!.options.caseid;

        const log = await getModeration(interaction.guild!).fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { caseId });

        const embed = await log.prepareEmbed();
        return interaction.reply({ embeds: [embed], ephemeral: args!.options.ephemeral ?? true });
    }
}

interface CaseCommandArgs {
    caseid: number;
    ephemeral: null | boolean;
}
