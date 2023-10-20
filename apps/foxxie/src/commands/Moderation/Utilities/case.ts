import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage, PermissionLevels } from '#lib/Types';
import { AddStringOption } from '#utils/chatInputDecorators';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { PermissionsBitField } from 'discord.js';
import { getFixedT } from 'i18next';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['modlog'],
    description: LanguageKeys.Commands.Moderation.CaseDescription,
    usage: LanguageKeys.Commands.Moderation.CaseUsage,
    permissionLevel: PermissionLevels.Moderator,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export default class UserCommand extends FoxxieCommand {
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const t = getFixedT('en-US');

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

        const log = await this.container.utilities.guild(message.guild).moderation.fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { id: caseId });

        const embed = await log.prepareEmbed();
        await send(message, { embeds: [embed], content: null });
    }

    @AddStringOption('case', 'the case to fetch', { commandName: 'case' })
    public async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction) {
        const caseId = interaction.options.getInteger('case', true);
        const ephemeral = interaction.options.getBoolean('hidden') || false;

        const log = await this.container.utilities.guild(interaction.guild).moderation.fetch(caseId);
        if (!log) this.error(LanguageKeys.Commands.Moderation.CaseNoExist, { id: caseId });

        const embed = await log.prepareEmbed();
        await interaction.reply({ ephemeral, embeds: [embed] });
    }
}
