import type { Connection, Repository } from 'typeorm';
import { GuildEntity, ModerationEntity, StarEntity } from './entities';
import { ClientRepository, MemberRepository, GuildRepository } from './repository';
import type { CommandInteraction, Message } from 'discord.js';
import { BrandingColors } from '#utils/constants';
import { container } from '@sapphire/framework';

export class MongoDB {
    public readonly connection: Connection;

    public readonly clients: ClientRepository;

    public readonly guilds: GuildRepository<GuildEntity>;

    public readonly members: MemberRepository;

    public readonly moderations: Repository<ModerationEntity>;

    public readonly starboards: Repository<StarEntity>;

    public constructor(connection: Connection) {
        this.connection = connection;
        this.clients = connection.getCustomRepository(ClientRepository);
        this.guilds = connection.getCustomRepository(GuildRepository);
        this.members = connection.getCustomRepository(MemberRepository);
        this.moderations = connection.getRepository(ModerationEntity);
        this.starboards = connection.getRepository(StarEntity);
    }

    public fetchColor(msg: Message | CommandInteraction): number {
        return msg.guild?.me?.displayColor || (msg as Message).member?.displayColor || BrandingColors.Primary;
    }

    public get serializers() {
        return container.stores.get('serializers');
    }
}

// eslint-disable-next-line no-redeclare
export interface MongoDB {
    readonly connection: Connection;
    readonly clients: ClientRepository;
    readonly guilds: GuildRepository<GuildEntity>;
    readonly members: MemberRepository;
    readonly moderation: ModerationEntity;
    readonly starboards: Repository<StarEntity>;
}
