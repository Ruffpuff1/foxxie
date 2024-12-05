import { join } from 'node:path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ClientEntity, MemberEntity } from './entities';
import { LastFmArtistEntity } from './entities/LastFmArtistEntity';
import { UserEntity } from './entities/UserEntity';
import { ClientRepository, LastFmArtistRepository, MemberRepository } from './repository';
import { UserRepository } from './repository/UserRepository';
import { MongoDB } from './MongoDB';
import { container } from '@sapphire/framework';

export async function config(): Promise<void> {
	const dataSource = new DataSource({
		type: 'mongodb',
		host: 'local',
		url: process.env.MONGO_URL,
		port: 3306,
		username: process.env.MONGO_USER,
		password: process.env.MONGO_PASSWORD,
		entities: [join(__dirname, 'entities/*Entity.js')],
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
