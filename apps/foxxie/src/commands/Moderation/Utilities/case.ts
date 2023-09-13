import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage, PermissionLevels } from '#lib/types';
import { getModeration } from '#utils/Discord';
import { getT } from '@foxxie/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['modlog'],
    description: LanguageKeys.Commands.Moderation.CaseDescription,
    usage: LanguageKeys.Commands.Moderation.CaseUsage,
    permissionLevel: PermissionLevels.Moderator,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export default class UserCommand extends FoxxieCommand {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const t = getT('en-US')

        registry.registerChatInputCommand(builder =>
            builder
                .setName(this.name)
                .setDescription(t(this.description))
                .setDMPermission(false)
                .setDefaultMemberPermissions(new PermissionsBitField([PermissionFlagsBits.ModerateMembers]).bitfield)
                .setNSFW(false)
                .addIntegerOption(option =>
                    option
                        .setName('case')
                        .setDescription('the case to fetch')
                        .setMinValue(1)
                        .setRequired(true)
                        .setAutocomplete(false)
                )
                .addBooleanOption(option => option.setName('hidden').setDescription('whether to hide').setRequired(false))
        );
    }

    public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const caseId = await args.pick('moderationLog');

        const log = await getModeration(message.guild).fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { id: caseId });

        const embed = await log.prepareEmbed();
        await send(message, { embeds: [embed], content: null });
    }

    public async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction) {
        const caseId = interaction.options.getInteger('case', true);
        const ephemeral = interaction.options.getBoolean('hidden') || false;

        const log = await getModeration(interaction.guild).fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { id: caseId });

        const embed = await log.prepareEmbed();
        await interaction.reply({ ephemeral, embeds: [embed] });
    }
}
