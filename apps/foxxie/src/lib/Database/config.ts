import { container } from '@sapphire/framework';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { MongoDB } from './MongoDB';
import { ClientEntity, GuildEntity, MemberEntity, ModerationEntity, ScheduleEntity, StarEntity } from './entities';
import { LastFmArtistEntity } from './entities/LastFmArtistEntity';
import { ClientRepository, GuildRepository, LastFmArtistRepository, MemberRepository } from './repository';

export async function config(): Promise<void> {
    const dataSource = new DataSource({
        type: 'mongodb',
        host: 'local',
        url: process.env.MONGO_URL,
        port: 3306,
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        entities: [ClientEntity, GuildEntity, LastFmArtistEntity, MemberEntity, ModerationEntity, ScheduleEntity, StarEntity],
        authSource: 'admin',
        ssl: true,
        logging: true
    });

    await dataSource.initialize();

    const clients = new ClientRepository(dataSource, ClientEntity);
    const guilds = new GuildRepository(dataSource, GuildEntity);
    const members = new MemberRepository(dataSource, MemberEntity);
    const lastFmArtists = new LastFmArtistRepository(dataSource, LastFmArtistEntity);

    container.db = new MongoDB(dataSource, clients, guilds, members, lastFmArtists);
}
