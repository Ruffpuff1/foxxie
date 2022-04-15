import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { container } from '@sapphire/framework';
import {
    GuildEntity,
    ClientEntity,
    MemberEntity,
    NoteEntity,
    StarEntity,
    UserEntity,
    ScamEntity,
    CommandEntity
} from './entities';
import { BackgroundEntity } from './entities/BackgroundEntity';
import { MongoDB } from './MongoDB';

export async function config(): Promise<void> {
    const connection = await createConnection({
        type: 'mongodb',
        host: 'local',
        url: process.env.MONGO_URL,
        port: 3306,
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        entities: [
            BackgroundEntity,
            CommandEntity,
            ClientEntity,
            GuildEntity,
            MemberEntity,
            NoteEntity,
            ScamEntity,
            StarEntity,
            UserEntity
        ],
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        logging: true
    });

    container.db = new MongoDB(connection);
}
