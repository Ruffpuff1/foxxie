import { AutocompleteCommand, Command } from '@sapphire/framework';
import { fetch } from '@foxxie/fetch';
import tinycolor from 'tinycolor2';
import { FuzzySearch } from '@foxxie/fuzzysearch';
import { RegisterChatInputCommand } from '@foxxie/commands';
import { getLocale } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS, getGuildIds } from '#utils/util';
import { resolveColorArgument } from '#utils/resolvers';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Color)
            .setDescription(LanguageKeys.Commands.Tools.ColorDescription)
            .addStringOption(option =>
                option //
                    .setName('color')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.ColorOptionColor))
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addEphemeralOption(),
    {
        idHints: ['946619789583978496', '946619789583978496'],
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public override async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Color>): Promise<unknown> {
        const { ephemeral, color: colorArg, t } = args!;

        await interaction.deferReply({ ephemeral });
        const color = await resolveColorArgument(colorArg, t, interaction);
        // @ts-expect-error using private prop
        if (color._format === false) return interaction.editReply(t(LanguageKeys.Commands.Tools.ColorNotFound, { color: colorArg }));

        const attachment = await this.draw(color);

        const content = [
            `**${await this.getName(color.toHex())}**`,
            `Hex: ${color.toHexString()}`,
            `RGB: ${color.toRgbString()}`,
            `HSV: ${color.toHsvString()}`,
            `HSL: ${color.toHslString()}`
        ].join('\n');

        return interaction.editReply({ files: [{ attachment, name: 'color.png' }], content });
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

    private async getName(color: string) {
        const { name } = await fetch('https://colornames.org/search/json/') //
            .query('hex', color) //
            .json<{ name?: string }>();
        return name || 'Unnamed';
    }

    private async draw(color: tinycolor.Instance): Promise<Buffer> {
        return fetch('https://color.aero.bot') //
            .path('color') //
            .query({ color: color.toHexString() }) //
            .raw();
    }
}
