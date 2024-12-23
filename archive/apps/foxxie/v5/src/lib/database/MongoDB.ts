import type { Connection, Repository } from 'typeorm';
import { BackgroundEntity, GiveawayEntity, GuildEntity, ModerationEntity, NoteEntity, PlaylistEntity, ScamEntity, StarEntity, WarningEntity } from './entities';
import { UserRepository } from './repository/UserRepository';
import { ClientRepository, CommandRepository, MemberRepository } from './repository';
import { CommandInteraction, Message } from 'discord.js';
import { BrandingColors } from '#utils/constants';

export class MongoDB {
    public readonly connection: Connection;

    public readonly backgrounds: Repository<BackgroundEntity>;

    public readonly clients: ClientRepository;

    public readonly commands: CommandRepository;

    public readonly giveaways: Repository<GiveawayEntity>;

    public readonly guilds: Repository<GuildEntity>;

    public readonly members: MemberRepository;

    public readonly moderations: Repository<ModerationEntity>;

    public readonly notes: Repository<NoteEntity>;

    public readonly playlists: Repository<PlaylistEntity>;

    public readonly scams: Repository<ScamEntity>;

    public readonly starboards: Repository<StarEntity>;

    public readonly users: UserRepository;

    public readonly warnings: Repository<WarningEntity>;

    public constructor(connection: Connection) {
        this.connection = connection;
        this.backgrounds = connection.getRepository(BackgroundEntity);
        this.clients = connection.getCustomRepository(ClientRepository);
        this.commands = connection.getCustomRepository(CommandRepository);
        this.giveaways = connection.getRepository(GiveawayEntity);
        this.guilds = connection.getRepository(GuildEntity);
        this.members = connection.getCustomRepository(MemberRepository);
        this.moderations = connection.getRepository(ModerationEntity);
        this.notes = connection.getRepository(NoteEntity);
        this.playlists = connection.getRepository(PlaylistEntity);
        this.scams = connection.getRepository(ScamEntity);
        this.starboards = connection.getRepository(StarEntity);
        this.users = connection.getCustomRepository(UserRepository);
        this.warnings = connection.getRepository(WarningEntity);
    }

    public async fetchColor(msg: Message | CommandInteraction): Promise<number> {
        const user = await this.users.ensureProfile(msg instanceof Message ? msg.author.id : msg.user.id);
        return user.profile!.color || msg.guild?.me?.displayColor || (msg as Message).member?.displayColor || BrandingColors.Primary;
    }

    public async fetchModerationEntry(caseId: number, guildId: string): Promise<ModerationEntity | undefined> {
        return this.moderations.findOne({ caseId, guildId });
    }

    public async fetchStarsForGuild(guildId: string): Promise<StarEntity[]> {
        return this.starboards.find({
            where: {
                guildId: { $eq: guildId },
                enabled: { $eq: true }
            }
        });
    }
}

export interface MongoDB {
    readonly connection: Connection;
    readonly backgrounds: Repository<BackgroundEntity>;
    readonly clients: ClientRepository;
    readonly commands: CommandRepository;
    readonly giveaways: Repository<GiveawayEntity>;
    readonly guilds: Repository<GuildEntity>;
    readonly members: MemberRepository;
    readonly moderations: Repository<ModerationEntity>;
    readonly notes: Repository<NoteEntity>;
    readonly playlists: Repository<PlaylistEntity>;
    readonly scams: Repository<ScamEntity>;
    readonly starboards: Repository<StarEntity>;
    readonly users: UserRepository;
    readonly warnings: Repository<WarningEntity>;
}
