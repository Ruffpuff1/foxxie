import { GetArtistInfoResult, GetUserInfoResult } from '#Api/LastFm';
import { acquireSettings } from '#lib/Database';
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage } from '#lib/Types';
import { sendLoadingMessage } from '#utils/Discord';
import { floatPromise, getOption, getSubcommand, parseDescription, resolveClientColor } from '#utils/util';
import { getT } from '@foxxie/i18n';
import { cast } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, AutocompleteCommand, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { ActionRowBuilder, Locale, PermissionsBitField, StringSelectMenuBuilder } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['fm'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
    detailedDescription: LanguageKeys.Commands.Fun.LastFmDetailedDescription,
    subcommands: [
        { name: 'listening', messageRun: 'messageRunListening', chatInputRun: 'chatInputListening', default: true },
        { name: 'artist', messageRun: 'messageRunArtist', chatInputRun: 'chatInputArtist' }
    ]
})
export class UserCommand extends FoxxieCommand {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        const t = getT('en-US');
        const detailedDescription = t(this.detailedDescription);
        const artist = getSubcommand('artist', detailedDescription)!;
        const listening = getSubcommand('listening', detailedDescription)!;
        const optionArtist = getOption('artist', 'artist', detailedDescription)!;
        const optionUser = getOption('listening', 'user', detailedDescription)!;
        const optionHidden = getOption('artist', 'hidden', detailedDescription)!;

        registry.registerChatInputCommand(
            builder =>
                builder
                    .setName(this.name)
                    .setDescription(detailedDescription.description)
                    .setDMPermission(false)
                    .setDefaultMemberPermissions(
                        new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions]).bitfield
                    )
                    .setNSFW(false)
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
                    )
                    .addSubcommand(subcommand =>
                        subcommand
                            .setName(listening.command)
                            .setDescription(parseDescription(listening.description)!)
                            .setNameLocalization(Locale.EnglishUS, listening.command)
                            .setDescriptionLocalization(Locale.EnglishUS, parseDescription(listening.description))
                            .addStringOption(option =>
                                option
                                    .setName(optionUser.name)
                                    .setDescription(optionUser.description)
                                    .setNameLocalization(Locale.EnglishUS, optionUser.name)
                                    .setDescriptionLocalization(Locale.EnglishUS, optionUser.description)
                                    .setAutocomplete(true)
                                    .setRequired(false)
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
        const { name } = interaction.options.getFocused(true);

        switch (name) {
            case 'artist':
                return this.container.apis.lastFm.getAutocompleteArtistOptions(interaction);
            case 'user':
                return this.container.apis.lastFm.getAutocompleteUserOptions(interaction);
        }
    }

    public async chatInputArtist(interaction: Command.ChatInputCommandInteraction) {
        const [artist, ephemeral] = await this.container.apis.lastFm.getArtistArgOrLastPlayedArtistFromGuildMember(interaction);
        const defer = await interaction.deferReply({ ephemeral });

        const t = await acquireSettings(interaction.guildId!, s => s.getLanguage());
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

        const artistEntity = await this.container.apis.spotify.getOrStoreArtist(cast<GetArtistInfoResult>(artistData));

        const display = await this.container.apis.lastFm.displays.artist.build(
            artistEntity,
            t,
            resolveClientColor(interaction.guild),
            interaction.user.id,
            interaction.guildId!
        );

        await display.run(interaction);
    }

    public async messageRunArtist(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const [artist, loading] = await this.container.apis.lastFm.getArtistArgOrLastPlayedArtistFromGuildMember(message, args);
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

        const artistEntity = await this.container.apis.spotify.getOrStoreArtist(cast<GetArtistInfoResult>(artistData));

        const display = await this.container.apis.lastFm.displays.artist.build(
            artistEntity,
            args.t,
            resolveClientColor(message.guild, message.member.displayColor),
            message.author.id,
            message.guildId
        );

        await loading.delete();
        await display.run(message);
    }

    public async chatInputListening(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void> {
        const authorUsername = await this.container.apis.lastFm.getGuildMemberLastFmUsername(
            interaction.user.id,
            interaction.guildId
        );

        const username = interaction.options.getString('user') || authorUsername;
        const ephemeral = interaction.options.getBoolean('hidden') || false;

        if (!username) this.error('noUsername');
        await interaction.deferReply({ ephemeral });

        const t = await acquireSettings(interaction.guildId, s => s.getLanguage());
        let user = cast<GetUserInfoResult>(await this.container.apis.lastFm.getInfoFromUser(username));

        if (!user.user) {
            if (!authorUsername) this.error('noUsername');
            user = cast<GetUserInfoResult>(await this.container.apis.lastFm.getInfoFromUser(authorUsername));
        }

        const tracks = await this.container.apis.lastFm.getRecentTracksFromUser(user.user.name);

        const embed = await this.container.apis.lastFm.displays.play.build(
            tracks,
            authorUsername,
            t,
            resolveClientColor(interaction.guildId),
            user
        );

        await interaction.editReply({ content: null, embeds: [embed] });
    }

    public async messageRunListening(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        await sendLoadingMessage(message);

        const authorUsername = await this.container.apis.lastFm.getGuildMemberLastFmUsername(message.author.id, message.guild.id);
        const username = await args.pick('string').catch(() => authorUsername);
        if (!username) this.error('noUsername');

        let user = cast<GetUserInfoResult>(await this.container.apis.lastFm.getInfoFromUser(username));

        if (!user.user) {
            if (!authorUsername) this.error('noUsername');
            user = cast<GetUserInfoResult>(await this.container.apis.lastFm.getInfoFromUser(authorUsername));
        }

        const tracks = await this.container.apis.lastFm.getRecentTracksFromUser(user.user.name);

        const embed = await this.container.apis.lastFm.displays.play.build(
            tracks,
            authorUsername,
            args.t,
            resolveClientColor(message.guild, message.member.displayColor),
            user
        );

        await send(message, { content: null, embeds: [embed] });
    }
}
