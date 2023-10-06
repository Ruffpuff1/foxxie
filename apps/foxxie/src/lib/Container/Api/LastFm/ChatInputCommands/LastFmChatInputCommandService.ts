import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { getOption, getSubcommand } from '#utils/util';
import { RequiresClientPermissions } from '@sapphire/decorators';
import { UserError, container } from '@sapphire/framework';
import {
    ApplicationCommandOptionType,
    ChatInputApplicationCommandData,
    PermissionFlagsBits,
    PermissionsBitField
} from 'discord.js';
import { ArtistBuilders } from '../Builders/ArtistBuilders';
import { ContextModel } from '../Structures/Models/ContextModel';
import { getFixedT } from 'i18next';

export class LastFmChatInputCommandService {
    // private service: LastFmService;

    public chatInputCommandData: () => ChatInputApplicationCommandData = () => {
        const detailedDescription = this.#enUS(LanguageKeys.Commands.Fun.LastFmDetailedDescription);
        const artist = getSubcommand('artist', detailedDescription)!;
        const listening = getSubcommand('listening', detailedDescription)!;
        const optionArtist = getOption('artist', 'artist', detailedDescription)!;
        const optionUser = getOption('listening', 'user', detailedDescription)!;
        // const optionHidden = getOption('artist', 'hidden', detailedDescription)!;

        return {
            name: 'lastfm',
            description: detailedDescription.description,
            dmPermission: false,
            defaultMemberPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
                .bitfield,
            nsfw: false,
            options: [
                {
                    name: artist.command,
                    description: artist.description as string,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: optionArtist.name,
                            description: optionArtist.description as string,
                            autocomplete: true,
                            required: true,
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'hidden',
                            description: 'option to hide',
                            required: false,
                            type: ApplicationCommandOptionType.Boolean
                        }
                    ]
                },
                {
                    name: listening.command,
                    description: listening.description as string,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: optionUser.name,
                            description: optionUser.description,
                            required: false,
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'hidden',
                            description: 'option to hide',
                            required: false,
                            type: ApplicationCommandOptionType.Boolean
                        }
                    ]
                }
            ]
        };
    };

    #enUS = getFixedT('en-US');

    @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    public async artist(...[interaction]: ChatInputRunArgs) {
        const [artist, ephemeral] = await container.apis.lastFm.getArtistArgOrLastPlayedArtistFromGuildMember(interaction);
        await interaction.deferReply({ ephemeral });

        const t = await container.utilities.guild(interaction.guild!).settings.getT();

        const options = await new ArtistBuilders().artist(
            new ContextModel(
                { user: interaction.user, guild: interaction.guild, channel: interaction.channel!, t },
                await container.db.users.ensure(interaction.user.id),
                '/'
            ),
            artist
        );

        await interaction.editReply(options);
    }

    // @RequiresClientPermissions(new PermissionsBitField([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ManageMessages]))
    // public async listening(...[interaction]: ChatInputRunArgs) {
    //     const authorUsername = await this.service.getGuildMemberLastFmUsername(interaction.user.id, interaction.guildId);

    //     const authorEntity = await container.db.users.ensure(interaction.user.id);

    //     const username = interaction.options.getString('user') || authorUsername;
    //     const ephemeral = interaction.options.getBoolean('hidden') || false;

    //     const targetEntity =
    //         authorUsername === username
    //             ? authorEntity
    //             : username
    //             ? (await container.db.users.findOne({ where: { lastFm: { username } } })) || null
    //             : null;

    //     if (!username || !targetEntity) this.error('noUsername');
    //     await interaction.deferReply({ ephemeral });

    //     const t = await container.utilities.guild(interaction.guild!).settings.getT();
    //     const user = await this.service.getInfoFromUser(username, targetEntity);
    //     const tracks = await this.service.getRecentTracksFromUser(user.lastFm.username);

    //     const embed = await this.service.displays.play.build(
    //         tracks,
    //         authorUsername,
    //         t,
    //         resolveClientColor(interaction.guildId),
    //         user
    //     );

    //     await interaction.editReply({ content: null, embeds: [embed] });
    // }

    protected error(identifier: string | UserError, context?: unknown): never {
        throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
    }
}

type ChatInputRunArgs = [FoxxieCommand.ChatInputCommandInteraction];
