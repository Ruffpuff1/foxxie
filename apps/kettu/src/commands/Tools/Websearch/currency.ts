import { AutocompleteCommand, Command } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { Colors } from '#utils/constants';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { cryptoCompare, CryptoCompareResultOk } from '#utils/APIs';
import { Collection, MessageEmbed } from 'discord.js';
import { fetch } from '@foxxie/fetch';
import { FuzzySearch } from '#utils/FuzzySearch';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';
import { envIsDefined } from '#lib/env';

@RegisterChatInputCommand(
    CommandName.Currency,
    builder =>
        builder //
            .setDescription(enUS(LanguageKeys.Commands.Websearch.CurrencyDescription))
            .addStringOption(option =>
                option //
                    .setName('from')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.CurrencyOptionFrom))
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option =>
                option //
                    .setName('to')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.CurrencyOptionTo))
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addNumberOption(option =>
                option //
                    .setName('amount')
                    .setDescription(enUS(LanguageKeys.Commands.Websearch.CurrencyOptionAmount))
                    .setRequired(false)
            )
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                    .setRequired(false)
            ),
    ['947381920881311765', '947398139462164490'],
    {
        enabled: envIsDefined('CRYPTOCOMPARE_TOKEN')
    }
)
export class UserCommand extends Command {
    private keys!: string[];

    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Currency>): Promise<any> {
        const { ephemeral, to, from, amount = 1, t } = args!;

        await interaction.deferReply({ ephemeral: ephemeral ?? false });

        const result = await cryptoCompare(from, to);

        if (result.Response === 'Error')
            return interaction.editReply({
                content: t(LanguageKeys.Commands.Websearch.CurrencyNotCurrency, { from, to })
            });

        const value = ((result as CryptoCompareResultOk)[to] * amount).toFixed(2);

        const embed = new MessageEmbed() //
            .setColor(Colors.Default) //
            .setDescription(t(LanguageKeys.Commands.Websearch.CurrencyMessage, { amount: amount.toFixed(2), from, value, to }));

        return interaction.editReply({ embeds: [embed] });
    }

    public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        const opt = interaction.options.getFocused(true);

        const fuzz = new FuzzySearch(new Collection(this.keys.map(k => [k, { key: k }])), ['key']);
        const result = fuzz.runFuzzy(opt.value as string);

        return interaction.respond(result.slice(0, 20).map(r => ({ name: r.key, value: r.key })));
    }

    public async onLoad() {
        const list = await fetch('https://openexchangerates.org/api/currencies.json').json<{ name: string }[]>();
        this.keys = Object.keys(list);
    }
}
