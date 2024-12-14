import 'reflect-metadata';
import { rootFolder } from '#utils/constants';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

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

	// const clients = new ClientRepository(dataSource, ClientEntity);
	// const members = new MemberRepository(dataSource, MemberEntity);
	// const lastFmArtists = new LastFmArtistRepository(dataSource, LastFmArtistEntity);
	// const users = new UserRepository(dataSource, UserEntity);
}
