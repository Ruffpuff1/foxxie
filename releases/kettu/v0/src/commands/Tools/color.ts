import { AutocompleteCommand, Command } from '@sapphire/framework';
import { centra } from '@foxxie/centra';
import tinycolor from 'tinycolor2';
import { Emojis } from '#utils/constants';
import { FuzzySearch } from '#utils/FuzzySearch';
import { Collection } from 'discord.js';
import { RegisterChatInputCommand } from '#utils/decorators';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';

@RegisterChatInputCommand(
    CommandName.Color,
    builder =>
        builder //
            .setDescription("Preview an image of a color using it's hex or rgb code.")
            .addStringOption(option =>
                option //
                    .setName('color')
                    .setDescription('The color you want to preview, in hex or rgb format.')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                    .setRequired(false)
            ),
    ['946619789583978496', '946619789583978496']
)
export class UserCommand extends Command {
    public override async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Color>): Promise<unknown> {
        const { ephemeral, color: colorArg } = args!;

        await interaction.deferReply({ ephemeral });
        let color: tinycolor.Instance;

        if (colorArg.toLowerCase() === 'random') color = tinycolor.random();
        else if (colorArg.toLowerCase() === 'dominant') {
            const dom = await centra('https://color.aero.bot').path('dominant').query('image', interaction.user.avatarURL()).text();

            color = tinycolor(dom);
        } else {
            color = tinycolor(colorArg);
        }
        // @ts-expect-error using private prop
        if (color._format === false) return interaction.editReply(`${Emojis.Error} I couldn't parse \`${colorArg}\` to a valid color.`);

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
        const fuzz = new FuzzySearch(new Collection(Object.keys(tinycolor.names).map(k => [k, { color: k }])), ['color']);

        const arg = interaction.options.getString('color', true);
        const result = fuzz.runFuzzy(arg);

        const hasOpt = Boolean(tinycolor.names[arg as keyof typeof tinycolor.names]);

        if (!result.length)
            return interaction.respond([
                { name: 'random', value: 'random' },
                { name: 'dominant', value: 'dominant' }
            ]);

        const options = [];
        if (!hasOpt) options.push({ name: arg, value: arg });
        options.push(...result.slice(0, hasOpt ? 19 : 20).map(r => ({ name: r.color, value: r.color })));

        return interaction.respond(options);
    }

    private async getName(color: string) {
        const { name } = await centra('https://colornames.org/search/json/') //
            .query('hex', color) //
            .json();
        return name || 'Unnamed';
    }

    private async draw(color: tinycolor.Instance): Promise<Buffer> {
        return centra('https://color.aero.bot') //
            .path('color') //
            .query({ color: color.toHexString() }) //
            .raw();
    }
}
