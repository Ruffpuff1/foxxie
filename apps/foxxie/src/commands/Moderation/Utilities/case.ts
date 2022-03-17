import { FoxxieCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ChatInputArgs, CommandName, PermissionLevels } from '#lib/types';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { getModeration } from '#utils/Discord';
import { RegisterChatInputCommand } from '#utils/decorators';
import { enUS } from '#utils/util';

@RegisterChatInputCommand(
    CommandName.Case,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Moderation.CaseDescription))
            .addIntegerOption(option =>
                option //
                    .setName('caseid')
                    .setDescription('The id of the case to display.')
                    .setRequired(true)
            )
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription('e')
                    .setRequired(false)
            ),
    [],
    {
        requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
        permissionLevel: PermissionLevels.Moderator
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
