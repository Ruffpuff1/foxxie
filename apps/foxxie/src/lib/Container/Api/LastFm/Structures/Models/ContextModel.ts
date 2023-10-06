import { UserEntity } from '#lib/Database/entities/UserEntity';
import { Channel, Guild, User } from 'discord.js';
import { TFunction } from 'i18next';

export class ContextModel {
    public prefix: string;

    public guild: Guild;

    public channel: Channel;

    public user: User;

    public contextUser: UserEntity;

    public t: TFunction;

    public constructor(context: CommandContext, contextUser: UserEntity, prefix = '.') {
        this.prefix = prefix;
        this.guild = context.guild;
        this.channel = context.channel;
        this.user = context.user;
        this.contextUser = contextUser;
        this.t = context.t;
    }
}

interface CommandContext {
    guild: Guild;
    channel: Channel;
    user: User;
    t: TFunction;
}
