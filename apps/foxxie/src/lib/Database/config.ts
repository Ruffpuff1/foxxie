import { join } from 'node:path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { container } from '@sapphire/framework';
import { ClientRepository } from './repository/ClientRepository.js';
import { MemberRepository } from './repository/MemberRepository.js';
import { ClientEntity } from './entities/ClientEntity.js';
import { MemberEntity } from './entities/MemberEntity.js';
import { LastFmArtistEntity } from './entities/LastFmArtistEntity.js';
import { LastFmArtistRepository } from './repository/LastFmArtistRepository.js';
import { UserRepository } from './repository/UserRepository.js';
import { UserEntity } from './entities/UserEntity.js';
import { MongoDB } from './MongoDB.js';
import { rootFolder } from '#utils/constants';

export async function config(): Promise<void> {
	const dataSource = new DataSource({
		type: 'mongodb',
		host: 'local',
		url: process.env.MONGO_URL,
		port: 3306,
		username: process.env.MONGO_USER,
		password: process.env.MONGO_PASSWORD,
		entities: [join(rootFolder, 'src/lib/Database/entities/*Entity.js')],
		authSource: 'admin',
		ssl: true,
		logging: true
	});

	await dataSource.initialize();

	const clients = new ClientRepository(dataSource, ClientEntity);
	const members = new MemberRepository(dataSource, MemberEntity);
	const lastFmArtists = new LastFmArtistRepository(dataSource, LastFmArtistEntity);
	const users = new UserRepository(dataSource, UserEntity);

	container.db = new MongoDB(dataSource, clients, members, lastFmArtists, users);
}
