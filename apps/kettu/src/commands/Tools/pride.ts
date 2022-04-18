import { Command } from '@sapphire/framework';
import { RegisterChatInputCommand, toLocalizationMap } from '@foxxie/commands';
import { type ChatInputArgs, CommandName } from '#types/Interactions';
import { LanguageKeys } from '#lib/i18n';
import { enUS, getGuildIds } from '#utils/util';
import { fetch } from '@foxxie/fetch';
import type { GuildMember } from 'discord.js';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

@RegisterChatInputCommand(
    builder =>
        builder //
            .setName(CommandName.Pride)
            .setDescription(LanguageKeys.Commands.Tools.PrideDescription)
            .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Tools.PrideDescription))
            .addStringOption(option =>
                option //
                    .setName('flag')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.PrideOptionFlag))
                    .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Tools.PrideOptionFlag))
                    .setRequired(true)
                    .addChoices(...UserCommand.FlagChoices)
            )
            .addBooleanOption(option =>
                option //
                    .setName('guild-avatar')
                    .setDescription(enUS(LanguageKeys.Commands.Tools.PrideOptionGuildAvatar))
                    .setDescriptionLocalizations(toLocalizationMap(LanguageKeys.Commands.Tools.PrideOptionGuildAvatar))
                    .setRequired(false)
            )
            .addEphemeralOption(),
    {
        idHints: ['950369662179344414'],
        guildIds: getGuildIds()
    }
)
export class UserCommand extends Command {
    public override async chatInputRun(...[interaction, , args]: ChatInputArgs<CommandName.Pride>): Promise<any> {
        await interaction.deferReply({ ephemeral: args!.ephemeral ?? false });

        const attachment = await fetch('http://ravy.lgbt:7125') //
            .path('circle')
            .query({
                image:
                    args?.['guild-avatar'] && interaction.member
                        ? (interaction.member as GuildMember).displayAvatarURL({ size: 1024, format: 'png' })
                        : interaction.user.displayAvatarURL({ size: 1024, format: 'png' }),
                type: args!.flag
            })
            .raw();

        return interaction.editReply({
            files: [{ attachment, name: 'pride.png' }]
        });
    }

    public static FlagChoices: APIApplicationCommandOptionChoice<string>[] = [
        {
            name: 'Agender',
            value: 'agender'
        },
        {
            name: 'Asexual',
            value: 'asexual'
        },
        {
            name: 'Bisexual',
            value: 'bisexual'
        },
        {
            name: 'Genderfluid',
            value: 'genderfluid'
        },
        {
            name: 'Lesbian',
            value: 'lesbian'
        },
        {
            name: 'Nonbinary',
            value: 'nonbinary'
        },
        {
            name: 'Pansexual',
            value: 'pansexual'
        },
        {
            name: 'Pride',
            value: 'pride'
        },
        {
            name: 'Transgender',
            value: 'transgender'
        }
    ];
}
