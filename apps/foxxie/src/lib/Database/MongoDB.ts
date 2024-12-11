import { TaskStore } from '#lib/schedule';
import { BrandingColors } from '#utils/constants';
import { Message } from 'discord.js';
import { DataSource, Repository } from 'typeorm';

import { PollEntity } from './entities/PollEntity.js';
import { ClientRepository, LastFmArtistRepository, MemberRepository } from './repository/index.js';
import { UserRepository } from './repository/UserRepository.js';

export interface MongoDB {
	clients: ClientRepository;
	dataSource: DataSource;
	members: MemberRepository;
	polls: Repository<PollEntity>;
	users: UserRepository;
}

export class MongoDB {
	public clients: ClientRepository;

	public dataSource: DataSource;

	public lastFmArtists: LastFmArtistRepository;

	public members: MemberRepository;

	public polls: Repository<PollEntity>;

	public tasks = new TaskStore();

	public users: UserRepository;

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
