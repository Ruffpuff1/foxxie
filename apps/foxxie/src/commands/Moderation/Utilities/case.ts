import { FoxxieCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ChatInputArgs, CommandName, PermissionLevels } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { getModeration } from '#utils/Discord';
import { RegisterChatInputCommand, toLocalizationMap } from '@foxxie/commands';
import { getGuildIds } from '#utils/util';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Case)
            .setDescription(LanguageKeys.Commands.Moderation.CaseDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Moderation.CaseDescription))
            .addIntegerOption(option =>
                option //
                    .setName('caseid')
                    .setDescription(LanguageKeys.Commands.Moderation.CaseOptionCaseId)
                    .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Moderation.CaseOptionCaseId))
                    .setRequired(true)
            )
            .addEphemeralOption(true),
    {
        idHints: ['953883491332915201'],
        requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
        guildIds: getGuildIds(),
        ...({
            permissionLevel: PermissionLevels.Moderator
        } as any)
    }
)
export class UserCommand extends FoxxieCommand {
    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Case>) {
        const caseId = args!.caseid;

        const log = await getModeration(interaction.guild!).fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { caseId });

        const embed = await log.prepareEmbed();
        return interaction.reply({ embeds: [embed], ephemeral: args!.ephemeral ?? true });
    }
}
