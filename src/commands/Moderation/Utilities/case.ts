import { getSupportedLanguageT, getSupportedUserLanguageT, LanguageKeys } from '#lib/I18n/index';
import { getEmbed } from '#lib/moderation/common/util';
import { GuildModerationService } from '#lib/moderation/managers/GuildModerationService';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { PermissionLevels } from '#lib/Types/Utils';
import { resolveCase } from '#lib/util/resolvers/Case';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { applyLocalizedBuilder } from '@sapphire/plugin-i18next';
import { Awaitable, isNullish } from '@sapphire/utilities';
import { InteractionContextType, PermissionFlagsBits } from 'discord.js';

const Root = LanguageKeys.Commands.Moderation.Utilities.Case;

@ApplyOptions<FoxxieSubcommand.Options>({
    description: Root.Description,
    detailedDescription: LanguageKeys.Commands.Moderation.KickDetailedDescription,
    permissionLevel: PermissionLevels.Moderator,
    requiredClientPermissions: [PermissionFlagsBits.EmbedLinks],
    runIn: [CommandOptionsRunTypeEnum.GuildAny],
    hidden: true,
    subcommands: [{ name: 'view', chatInputRun: 'chatInputRunView', messageRun: 'messageRunView', default: true }]
})
export class UserCommand extends FoxxieSubcommand {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry): Awaitable<void> {
        registry.registerChatInputCommand(
            builder =>
                applyLocalizedBuilder(builder, Root.Name, Root.Description)
                    .setContexts(InteractionContextType.Guild)
                    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
                    .addSubcommand(subcommand =>
                        applyLocalizedBuilder(subcommand, Root.View) //
                            .addIntegerOption(option =>
                                applyLocalizedBuilder(option, Root.OptionsCase)
                                    .setMinValue(1)
                                    .setRequired(true)
                                    .setAutocomplete(true)
                            )
                            .addBooleanOption(option => applyLocalizedBuilder(option, Root.OptionsShow))
                    ),
            {
                idHints: [
                    '1313102423719542844' // Foxxie Nightly
                ]
            }
        );
    }

    public async chatInputRunView(interaction: FoxxieSubcommand.Interaction) {
        const entry = await this.#getCase(interaction, true);
        const show = interaction.options.getBoolean('show') ?? false;
        const t = show ? getSupportedLanguageT(interaction) : getSupportedUserLanguageT(interaction);

        return interaction.reply({ embeds: [await getEmbed(t, entry)], ephemeral: !show });
    }

    async #getCase(interaction: FoxxieSubcommand.Interaction, required: true): Promise<GuildModerationService.Entry>;
    async #getCase(interaction: FoxxieSubcommand.Interaction, required?: false): Promise<GuildModerationService.Entry | null>;
    async #getCase(interaction: FoxxieSubcommand.Interaction, required?: boolean) {
        const caseId = interaction.options.getInteger('case', required);
        if (isNullish(caseId)) return null;

        const parameter = caseId.toString();
        const t = getSupportedUserLanguageT(interaction);
        return (await resolveCase(parameter, t, interaction.guild!)).unwrapRaw();
    }
}
