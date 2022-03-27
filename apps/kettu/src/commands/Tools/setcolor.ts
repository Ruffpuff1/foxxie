import { AutocompleteCommand, Command } from '@sapphire/framework';
import { getLocale, RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';
import { resolveColorArgument } from '#utils/resolvers';
import { ColorResolvable, DiscordAPIError, GuildMember } from 'discord.js';
import { PermissionFlagsBits, RESTJSONErrorCodes } from 'discord-api-types/v10';
import tinycolor from 'tinycolor2';
import { FuzzySearch } from '@foxxie/fuzzysearch';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Setcolor)
            .setDescription(LanguageKeys.Commands.Tools.SetcolorDescription)
            .addRoleOption(option =>
                option //
                    .setName('role')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.SetcolorOptionRole))
                    .setRequired(true)
            )
            .addStringOption(option =>
                option //
                    .setName('color')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.SetcolorOptionColor))
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option =>
                option //
                    .setName('reason')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.SetcolorOptionReason))
                    .setRequired(false)
            ),
    {
        idHints: ['950400529970888707'],
        requiredClientPermissions: PermissionFlagsBits.ManageRoles
    }
)
export class UserCommand extends Command {
    public override async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Setcolor>): Promise<unknown> {
        const { color: colorArg, t, role, reason } = args!;

        await interaction.deferReply();
        const color = await resolveColorArgument(colorArg, t, interaction);
        // @ts-expect-error using private prop
        if (color._format === false) return interaction.editReply(t(LanguageKeys.Commands.Tools.ColorNotFound, { color: colorArg }));

        try {
            await role.setColor(color.toHexString() as ColorResolvable, reason || t(LanguageKeys.Commands.Tools.SetcolorReason));
        } catch (error) {
            if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.MissingPermissions) {
                const myRole = interaction.guild?.roles.botRoleFor(interaction.guild?.me as GuildMember);
                return interaction.editReply(t(LanguageKeys.Commands.Tools.SetcolorNoPerms, { context: myRole?.id === role.id ? 'mine' : '', role: role.name }));
            }

            return interaction.editReply(t(LanguageKeys.Commands.Tools.SetcolorError, { role: role.name }));
        }

        return interaction.editReply(t(LanguageKeys.Commands.Tools.SetcolorSuccess, { role: role.name, color: color.toHexString() }));
    }

    public override autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        const fuzz = new FuzzySearch(Object.keys(tinycolor.names), ['key']);

        const arg = interaction.options.getString('color', true);
        const result = fuzz.runFuzzy(arg);
        const t = getLocale(interaction);

        const hasOpt = Boolean(tinycolor.names[arg as keyof typeof tinycolor.names]);
        const random = t(LanguageKeys.Commands.Tools.ColorRandom);
        const dominant = t(LanguageKeys.Commands.Tools.ColorDominant);

        if (!result.length)
            return interaction.respond([
                { name: random, value: random },
                { name: dominant, value: dominant }
            ]);

        const options = [];
        if (!hasOpt) options.push({ name: arg, value: arg });
        options.push(...result.slice(0, hasOpt ? 19 : 20).map(r => ({ name: r.key, value: r.key })));

        return interaction.respond(options);
    }
}
