import { DataSource, Repository } from 'typeorm';
import { ClientRepository, LastFmArtistRepository, MemberRepository } from './repository';
import { PollEntity } from './entities/PollEntity';
import { UserRepository } from './repository/UserRepository';
import { TaskStore } from '#lib/schedule';
import { BrandingColors } from '#utils/constants';
import { Message } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class MongoDB {
	public readonly dataSource: DataSource;

	public readonly clients: ClientRepository;

	public readonly members: MemberRepository;

	public readonly lastFmArtists: LastFmArtistRepository;

	public readonly polls: Repository<PollEntity>;

	public readonly users: UserRepository;

	public tasks = new TaskStore();

	public constructor(
		dataSource: DataSource,
		clients: ClientRepository,
		members: MemberRepository,
		lastFmArtists: LastFmArtistRepository,
		users: UserRepository
	) {
		this.dataSource = dataSource;
		this.clients = clients;
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
	readonly members: MemberRepository;
	readonly polls: Repository<PollEntity>;
	readonly users: UserRepository;
}
