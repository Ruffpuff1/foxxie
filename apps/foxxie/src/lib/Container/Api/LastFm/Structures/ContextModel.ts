import { UserEntity } from '#lib/Database/entities/UserEntity';
import { TFunction } from '@foxxie/i18n';
import { Channel, Guild, User } from 'discord.js';

export class ContextModel {
    public prefix: string;

    public guild: Guild;

    public channel: Channel;

    public user: User;

    public contextUser: UserEntity | null;

    public t: TFunction

    public constructor(context: CommandContext, prefix: string, contextUser: UserEntity | null = null) {
        this.prefix = prefix;
        this.guild = context.guild;
        this.channel = context.channel;
        this.user = context.user;
        this.contextUser = contextUser;
        this.t = context.t
    }
}

interface CommandContext {
    guild: Guild;
    channel: Channel;
    user: User;
    t: TFunction
}
