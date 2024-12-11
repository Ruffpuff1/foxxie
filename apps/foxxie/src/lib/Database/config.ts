import { container } from '@sapphire/framework';
import 'reflect-metadata';
import { rootFolder } from '#utils/constants';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

import { ClientEntity } from './entities/ClientEntity.js';
import { LastFmArtistEntity } from './entities/LastFmArtistEntity.js';
import { MemberEntity } from './entities/MemberEntity.js';
import { UserEntity } from './entities/UserEntity.js';
import { MongoDB } from './MongoDB.js';
import { ClientRepository } from './repository/ClientRepository.js';
import { LastFmArtistRepository } from './repository/LastFmArtistRepository.js';
import { MemberRepository } from './repository/MemberRepository.js';
import { UserRepository } from './repository/UserRepository.js';

export async function config(): Promise<void> {
	const dataSource = new DataSource({
		authSource: 'admin',
		entities: [join(rootFolder, 'src/lib/Database/entities/*Entity.js')],
		host: 'local',
		logging: true,
		password: process.env.MONGO_PASSWORD,
		port: 3306,
		ssl: true,
		type: 'mongodb',
		url: process.env.MONGO_URL,
		username: process.env.MONGO_USER
	});

	await dataSource.initialize();

	const clients = new ClientRepository(dataSource, ClientEntity);
	const members = new MemberRepository(dataSource, MemberEntity);
	const lastFmArtists = new LastFmArtistRepository(dataSource, LastFmArtistEntity);
	const users = new UserRepository(dataSource, UserEntity);

	container.db = new MongoDB(dataSource, clients, members, lastFmArtists, users);
}
