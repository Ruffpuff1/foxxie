import { TaskStore } from '#lib/Container/Stores/Tasks/TaskStore';
import { BrandingColors } from '#utils/constants';
import { container } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { DataSource, Repository } from 'typeorm';
import { GuildEntity, ModerationEntity, StarEntity } from './entities';
import { PollEntity } from './entities/PollEntity';
import { ClientRepository, GuildRepository, LastFmArtistRepository, MemberRepository } from './repository';
import { UserRepository } from './repository/UserRepository';
import { LastFmDatabase, SerializerStore } from './structures';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class MongoDB {
    public readonly dataSource: DataSource;

    public readonly clients: ClientRepository;

    public readonly guilds: GuildRepository<GuildEntity>;

    public readonly members: MemberRepository;

    public readonly lastFmArtists: LastFmArtistRepository;

    public readonly lastFm: LastFmDatabase;

    public readonly moderations: Repository<ModerationEntity>;

    public readonly polls: Repository<PollEntity>;

    public readonly starboards: Repository<StarEntity>;

    public readonly users: UserRepository;

    public serializers = new SerializerStore();

    public tasks = new TaskStore();

    public constructor(
        dataSource: DataSource,
        clients: ClientRepository,
        guilds: GuildRepository<GuildEntity>,
        members: MemberRepository,
        lastFmArtists: LastFmArtistRepository,
        users: UserRepository
    ) {
        this.dataSource = dataSource;
        this.clients = clients;
        this.guilds = guilds;
        this.members = members;
        this.moderations = dataSource.getRepository(ModerationEntity);
        this.polls = dataSource.getRepository(PollEntity);
        this.starboards = dataSource.getRepository(StarEntity);
        this.users = users;
        this.lastFmArtists = lastFmArtists;

        this.lastFm = new LastFmDatabase(dataSource);
    }

    public fetchColor(msg: Message): number {
        return msg.member?.displayColor || container.utilities.guild(msg.guild!).maybeMe?.displayColor || BrandingColors.Primary;
    }
}

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-unsafe-declaration-merging
export interface MongoDB {
    readonly dataSource: DataSource;
    readonly clients: ClientRepository;
    readonly guilds: GuildRepository<GuildEntity>;
    readonly lastFm: LastFmDatabase;
    readonly members: MemberRepository;
    readonly moderation: ModerationEntity;
    readonly polls: Repository<PollEntity>;
    readonly starboards: Repository<StarEntity>;
    readonly users: UserRepository;
}
