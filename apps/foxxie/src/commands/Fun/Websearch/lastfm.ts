import { acquireSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { LastFmArtistGetInfoResult, buildArtistDisplay } from '#lib/Api/lastfm';
import { sendLoadingMessage } from '#utils/Discord';
import { floatPromise, getOption, getSubcommand, parseDescription, resolveClientColor } from '#utils/util';
import { getT } from '@foxxie/i18n';
import { cast } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, AutocompleteCommand, Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { ActionRowBuilder, Locale, StringSelectMenuBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['fm'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Fun.LastFmDetailedDescription,
    subcommands: [{ name: 'artist', default: true, messageRun: 'messageRunArtist', chatInputRun: 'chatInputArtist' }]
})
export class UserCommand extends FoxxieCommand {
    private static artist = Args.make<string>((parameter, { argument }) => {
        const lower = parameter?.toLowerCase();
        if (!lower) return Args.error({ argument, parameter, identifier: 'noArtistProvided' });
        return Args.ok(lower);
    });

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const t = getT('en-US');
        const detailedDescription = t(this.detailedDescription);
        const artist = getSubcommand('artist', detailedDescription)!;
        const optionArtist = getOption('artist', 'artist', detailedDescription)!;
        const optionHidden = getOption('artist', 'hidden', detailedDescription)!;

        registry.registerChatInputCommand(
            builder =>
                builder //
                    .setName(this.name)
                    .setDescription(detailedDescription.description)
                    .addSubcommand(subcommand =>
                        subcommand
                            .setName(artist.command)
                            .setDescription(parseDescription(artist.description)!)
                            .setNameLocalization(Locale.EnglishUS, artist.command)
                            .setDescriptionLocalization(Locale.EnglishUS, parseDescription(artist.description))
                            .addStringOption(option =>
                                option
                                    .setName(optionArtist.name)
                                    .setDescription(optionArtist.description)
                                    .setNameLocalization(Locale.EnglishUS, optionArtist.name)
                                    .setDescriptionLocalization(Locale.EnglishUS, optionArtist.description)
                                    .setAutocomplete(true)
                                    .setRequired(true)
                            )
                            .addBooleanOption(option =>
                                option
                                    .setName(optionHidden.name)
                                    .setDescription(optionHidden.description)
                                    .setNameLocalization(Locale.EnglishUS, optionHidden.name)
                                    .setDescriptionLocalization(Locale.EnglishUS, optionHidden.description)
                                    .setRequired(false)
                            )
                    ),
            { idHints: ['1149530889907347466'] }
        );
    }

    public async autocompleteRun(...[interaction]: Parameters<AutocompleteCommand['autocompleteRun']>) {
        return this.container.apis.lastFm.getAutocompleteArtistOptions(interaction);
    }

    public async chatInputArtist(interaction: Command.ChatInputCommandInteraction) {
        const artist = interaction.options.getString('artist', true);
        const ephemeral = interaction.options.getBoolean('hidden') || false;
        const t = await acquireSettings(interaction.guildId!, s => s.getLanguage());

        const defer = await interaction.deferReply({ ephemeral });
        const artistData = await this.container.apis.lastFm.getInfoFromArtist(artist);

        if (Reflect.has(artistData, 'error')) {
            const options = await this.container.apis.lastFm.getSelectMenuArtistOptions(artist);
            if (!options.length) this.error('no search results');

            const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
                .addComponents(new StringSelectMenuBuilder().setCustomId(`lastfm|artist|${defer.id}`).setOptions(options));

            await interaction.editReply({
                content: t(LanguageKeys.Commands.Fun.AnimalcrossingNoVillager, { villager: artist }),
                components: [actionRow]
            });

            return;
        }

        const artistEntity = await this.container.apis.spotify.getOrStoreArtist(cast<LastFmArtistGetInfoResult>(artistData));
        const artistBody = cast<LastFmArtistGetInfoResult>(artistData).artist;

        const display = await buildArtistDisplay(
            artistBody,
            artistEntity,
            t,
            resolveClientColor(interaction.guild),
            interaction.user.id,
            interaction.guildId!
        );

        await display.run(interaction);
    }

    public async messageRunArtist(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const artist = await args.rest(UserCommand.artist);

        const loading = await sendLoadingMessage(message);
        const artistData = await this.container.apis.lastFm.getInfoFromArtist(artist);

        if (Reflect.has(artistData, 'error')) {
            const options = await this.container.apis.lastFm.getSelectMenuArtistOptions(artist);
            if (!options.length) this.error('no search results');

            const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>() //
                .addComponents(new StringSelectMenuBuilder().setCustomId(`lastfm|artist|${message.id}`).setOptions(options));

            await floatPromise(loading.delete());

            await message.channel.send({
                content: args.t(LanguageKeys.Commands.Fun.AnimalcrossingNoVillager, { villager: artist }),
                components: [actionRow]
            });

            return;
        }

        const artistEntity = await this.container.apis.spotify.getOrStoreArtist(cast<LastFmArtistGetInfoResult>(artistData));
        const artistBody = cast<LastFmArtistGetInfoResult>(artistData).artist;

        const display = await buildArtistDisplay(
            artistBody,
            artistEntity,
            args.t,
            resolveClientColor(message.guild, message.member.displayColor),
            message.author.id,
            message.guildId
        );

        await loading.delete();

        await display.run(message);
    }
}
