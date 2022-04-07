import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { container } from '@sapphire/framework';
import { GuildEntity, ClientEntity, MemberEntity, ModerationEntity, NoteEntity, WarningEntity, ScheduleEntity, StarEntity } from './entities';
import { MongoDb } from './stuctures/MongoDb';

export async function config(): Promise<void> {
    const connection = await createConnection({
        type: 'mongodb',
        host: 'local',
        url: process.env.MONGO_URL,
        port: 3306,
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
        entities: [
            ClientEntity,
            GuildEntity,
            MemberEntity,
            ModerationEntity,
            NoteEntity,
            ScheduleEntity,
            StarEntity,
            WarningEntity
        ],
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        logging: true
    });

    container.db = new MongoDb(connection);
}