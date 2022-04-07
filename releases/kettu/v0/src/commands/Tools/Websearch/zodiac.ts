import { centra } from '@foxxie/centra';
import { Command, UserError } from '@sapphire/framework';
import { RegisterChatInputCommand } from '#utils/decorators';
import { Colors, Emojis } from '#utils/constants';
import { Sunsigns, Days, Query, QueryGetHoroscopeArgs } from '@skyra/saelem';
import { MessageEmbed } from 'discord.js';
import { toTitleCase } from '@ruffpuff/utilities';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS } from '#utils/util';
import { envParseBoolean } from '#lib/env';

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
    CommandName.Zodiac,
    builder =>
        builder //
            .setDescription('Search for your daily horoscope using Saelem.')
            .addStringOption(option =>
                option //
                    .setName('sign')
                    .setDescription('The star sign to search.')
                    .setRequired(true)
                    .addChoices(UserCommand.Zodiacs)
            )
            .addStringOption(option =>
                option //
                    .setName('day')
                    .setDescription('The day to search for the horoscope.')
                    .setRequired(false)
                    .addChoices(UserCommand.Days)
            )
            .addBooleanOption(option =>
                option //
                    .setName('ephemeral')
                    .setDescription(enUS(LanguageKeys.System.OptionEphemeralDefaultFalse))
                    .setRequired(false)
            ),
    ['946882459788779590', '946882459788779590'],
    {
        enabled: envParseBoolean('SAELEM_ENABLED')
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
            .setColor(Colors.Default)
            .setFooter({ text: 'Powered by Saelem' });

        return interaction.editReply({
            embeds: [embed]
        });
    }

    private async fetchSaelem<R extends SaelemQueryReturnTypes>(variables: SaelemQueryVariables<R>, query = SaelemQueryString) {
        try {
            return centra('http://saelem:8284', 'POST')
                .body({
                    query,
                    variables
                })
                .json<SaelemResponse<R>>();
        } catch {
            throw new UserError({ message: `${Emojis.Error} I'm sorry that query failed.`, identifier: '' });
        }
    }

    public static readonly Zodiacs: [name: string, value: Sunsigns][] = [
        ['Aquarius', Sunsigns.Aquarius],
        ['Aries', Sunsigns.Aries],
        ['Cancer', Sunsigns.Cancer],
        ['Capricorn', Sunsigns.Capricorn],
        ['Gemini', Sunsigns.Gemini],
        ['Leo', Sunsigns.Leo],
        ['Libra', Sunsigns.Libra],
        ['Pisces', Sunsigns.Pisces],
        ['Sagittarius', Sunsigns.Sagittarius],
        ['Scorpio', Sunsigns.Scorpio],
        ['Taurus', Sunsigns.Taurus],
        ['Virgo', Sunsigns.Virgo]
    ];

    public static readonly Days: [name: string, value: Days][] = [
        ['Today', Days.Today],
        ['Tomorrow', Days.Tomorrow],
        ['Yesterday', Days.Yesterday]
    ];
}

export type SaelemQueryReturnTypes = keyof Pick<Query, 'getHoroscope'>;

export interface SaelemResponse<K extends keyof Omit<Query, '__typename'>> {
    data: Record<K, Omit<Query[K], '__typename'>>;
}

type SaelemQueryVariables<R extends SaelemQueryReturnTypes> = R extends 'getHoroscope' ? QueryGetHoroscopeArgs : never;
