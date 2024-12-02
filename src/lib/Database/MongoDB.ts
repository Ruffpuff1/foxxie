import { TaskStore } from '#lib/Container/Stores/Tasks/TaskStore';
import { BrandingColors } from '#utils/constants';
import type { Message } from 'discord.js';
import type { DataSource, Repository } from 'typeorm';
import { GuildEntity } from './entities';
import { PollEntity } from './entities/PollEntity';
import { ClientRepository, GuildRepository, LastFmArtistRepository, MemberRepository } from './repository';
import { UserRepository } from './repository/UserRepository';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class MongoDB {
    public readonly dataSource: DataSource;

    public readonly clients: ClientRepository;

    public readonly guilds: GuildRepository<GuildEntity>;

    public readonly members: MemberRepository;

    public readonly lastFmArtists: LastFmArtistRepository;

    public readonly polls: Repository<PollEntity>;

    public readonly users: UserRepository;

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
        this.polls = dataSource.getRepository(PollEntity);
        this.users = users;
        this.lastFmArtists = lastFmArtists;
    }

    public fetchColor(msg: Message): number {
        return msg.member?.displayColor || BrandingColors.Primary;
    }
}

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-unsafe-declaration-merging
export interface MongoDB {
    readonly dataSource: DataSource;
    readonly clients: ClientRepository;
    readonly guilds: GuildRepository<GuildEntity>;
    readonly members: MemberRepository;
    readonly polls: Repository<PollEntity>;
    readonly users: UserRepository;
}
