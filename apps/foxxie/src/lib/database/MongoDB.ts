import type { Connection, Repository } from 'typeorm';
import { BackgroundEntity, GuildEntity, NoteEntity, ScamEntity, StarEntity, WarningEntity } from './entities';
import { UserRepository } from './repository/UserRepository';
import { ClientRepository, CommandRepository, MemberRepository } from './repository';
import { CommandInteraction, Message } from 'discord.js';
import { BrandingColors } from '#utils/constants';

export class MongoDB {
    public readonly connection: Connection;

    public readonly backgrounds: Repository<BackgroundEntity>;

    public readonly clients: ClientRepository;

    public readonly commands: CommandRepository;

    public readonly guilds: Repository<GuildEntity>;

    public readonly members: MemberRepository;

    public readonly notes: Repository<NoteEntity>;

    public readonly scams: Repository<ScamEntity>;

    public readonly starboards: Repository<StarEntity>;

    public readonly users: UserRepository;

    public readonly warnings: Repository<WarningEntity>;

    public constructor(connection: Connection) {
        this.connection = connection;
        this.backgrounds = connection.getRepository(BackgroundEntity);
        this.clients = connection.getCustomRepository(ClientRepository);
        this.commands = connection.getCustomRepository(CommandRepository);
        this.guilds = connection.getRepository(GuildEntity);
        this.members = connection.getCustomRepository(MemberRepository);
        this.notes = connection.getRepository(NoteEntity);
        this.scams = connection.getRepository(ScamEntity);
        this.starboards = connection.getRepository(StarEntity);
        this.users = connection.getCustomRepository(UserRepository);
        this.warnings = connection.getRepository(WarningEntity);
    }

    public async fetchColor(msg: Message | CommandInteraction): Promise<number> {
        const user = await this.users.ensureProfile(msg instanceof Message ? msg.author.id : msg.user.id);
        return user.profile!.color || msg.guild?.me?.displayColor || (msg as Message).member?.displayColor || BrandingColors.Primary;
    }

    public async fetchStarsForGuild(guildId: string): Promise<StarEntity[]> {
        return this.starboards.find({
            where: {
                guildId: { $eq: guildId },
                enabled: { $eq: true }
            }
        });
    }
}

// eslint-disable-next-line no-redeclare
export interface MongoDB {
    readonly connection: Connection;
    readonly backgrounds: Repository<BackgroundEntity>;
    readonly clients: ClientRepository;
    readonly commands: CommandRepository;
    readonly guilds: Repository<GuildEntity>;
    readonly members: MemberRepository;
    readonly notes: Repository<NoteEntity>;
    readonly scams: Repository<ScamEntity>;
    readonly starboards: Repository<StarEntity>;
    readonly users: UserRepository;
    readonly warnings: Repository<WarningEntity>;
}
