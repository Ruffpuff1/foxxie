import { fetch } from '@foxxie/fetch';
import { Command, UserError } from '@sapphire/framework';
import { RegisterChatInputCommand, toLocalizationMap, toLocalizationChoiceMap } from '@foxxie/commands';
import { Colors, Emojis } from '#utils/constants';
import { Sunsigns, Days, Query, QueryGetHoroscopeArgs } from '@skyra/saelem';
import { MessageEmbed } from 'discord.js';
import { toTitleCase } from '@ruffpuff/utilities';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { EnvParse } from '@foxxie/env';
import { getGuildIds } from '#utils/util';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

const SaelemQueryString = `query getHoroscope($sunsign: Sunsigns!, $day: Days!) {
    getHoroscope(sunsign: $sunsign, day: $day) {
        date
        intensity
        keywords
        mood
        prediction
        rating
    }
}`;

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Zodiac)
            .setDescription(LanguageKeys.Commands.Websearch.ZodiacDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Websearch.ZodiacDescription))
            .addStringOption(option =>
                option //
                    .setName('sign')
                    .setDescription('The star sign to search.')
                    .setRequired(true)
                    .addChoices(...UserCommand.Zodiacs)
            )
            .addStringOption(option =>
                option //
                    .setName('day')
                    .setDescription('The day to search for the horoscope.')
                    .setRequired(false)
                    .addChoices(...UserCommand.Days)
            )
            .addEphemeralOption(),
    {
        idHints: ['946882459788779590', '946882459788779590'],
        enabled: EnvParse.boolean('SAELEM_ENABLED'),
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Zodiac>): Promise<unknown> {
        const { ephemeral, day = Days.Today, sign } = args!;
        await interaction.deferReply({ ephemeral: ephemeral ?? false });

        const { data } = await this.fetchSaelem({ day, sunsign: sign });

        const embed = new MessageEmbed()
            .setAuthor({ name: `Horoscope for ${toTitleCase(sign)}` })
            .setDescription(data.getHoroscope.prediction)
            .addField('**:dart: Intensity**', data.getHoroscope.intensity, true)
            .addField('**:label: Keywords**', data.getHoroscope.keywords.join(', '), true)
            .addField('**:revolving_hearts: Mood**', data.getHoroscope.mood, true)
            .setColor(interaction?.guild?.me?.displayColor || Colors.Default)
            .setFooter({ text: 'Powered by Saelem' });

        return interaction.editReply({
            embeds: [embed]
        });
    }

    private async fetchSaelem<R extends SaelemQueryReturnTypes>(variables: SaelemQueryVariables<R>, query = SaelemQueryString) {
        try {
            return fetch('http://saelem:8284', 'POST')
                .body({
                    query,
                    variables
                })
                .json<SaelemResponse<R>>();
        } catch {
            throw new UserError({ message: `${Emojis.Error} I'm sorry that query failed.`, identifier: '' });
        }
    }

    public static readonly Zodiacs: APIApplicationCommandOptionChoice<Sunsigns>[] = [
        {
            value: Sunsigns.Aquarius,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacAquarius)
        },
        {
            value: Sunsigns.Aries,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacAries)
        },
        {
            value: Sunsigns.Cancer,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacCancer)
        },
        {
            value: Sunsigns.Capricorn,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacCapricorn)
        },
        {
            value: Sunsigns.Gemini,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacGemini)
        },
        {
            value: Sunsigns.Leo,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacLeo)
        },
        {
            value: Sunsigns.Libra,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacLibra)
        },
        {
            value: Sunsigns.Pisces,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacPisces)
        },
        {
            value: Sunsigns.Sagittarius,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacSagittarius)
        },
        {
            value: Sunsigns.Scorpio,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacScorpio)
        },
        {
            value: Sunsigns.Taurus,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacTaurus)
        },
        {
            value: Sunsigns.Virgo,
            ...toLocalizationChoiceMap(LanguageKeys.Interactions.ChoiceZodiacVirgo)
        }
    ];

    public static readonly Days: APIApplicationCommandOptionChoice<Days>[] = [
        {
            name: 'Today',
            value: Days.Today
        },
        {
            name: 'Tomorrow',
            value: Days.Tomorrow
        },
        {
            name: 'Yesterday',
            value: Days.Yesterday
        }
    ];
}

export type SaelemQueryReturnTypes = keyof Pick<Query, 'getHoroscope'>;

export interface SaelemResponse<K extends keyof Omit<Query, '__typename'>> {
    data: Record<K, Omit<Query[K], '__typename'>>;
}

type SaelemQueryVariables<R extends SaelemQueryReturnTypes> = R extends 'getHoroscope' ? QueryGetHoroscopeArgs : never;
