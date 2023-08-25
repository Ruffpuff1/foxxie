import type FoxxieClient from '#lib/FoxxieClient';
import type { MongoDB } from '#lib/database';
import { DetailedDescription, PermissionLevels } from '#lib/types';
import { clientOwners } from '#root/config';
import { CustomFunctionGet } from '@foxxie/i18n';
import { seconds } from '@ruffpuff/utilities';
import { CommandOptionsRunTypeEnum, MessageCommandContext, PieceContext, UserError } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import * as Lexure from 'lexure';
import { FoxxieArgs } from './parsers';

export abstract class FoxxieCommand<T = unknown> extends SubCommandPluginCommand<FoxxieArgs, FoxxieCommand> {
    public readonly guarded: boolean;

    public hidden: boolean;

    public allowedGuilds: string[];

    public usage: string | null = null;

    public permissionLevel: PermissionLevels;

    public declare detailedDescription: CustomFunctionGet<
        string,
        {
            prefix: string;
        },
        DetailedDescription
    >;

    public constructor(context: PieceContext, options: FoxxieCommand.Options) {
        super(context, {
            cooldownDelay: seconds(5),
            cooldownLimit: 2,
            runIn: [CommandOptionsRunTypeEnum.GuildAny],
            cooldownFilteredUsers: clientOwners,
            generateDashLessAliases: true,
            ...options
        });

        this.guarded = options.guarded ?? false;
        this.usage = options.usage ?? null;
        this.hidden = options.hidden ?? false;
        this.allowedGuilds = options.allowedGuilds ?? [];
        this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;
        this.detailedDescription = options.detailedDescription!;

        if (options.guarded) this.guarded = true;
    }

    public addAllowedGuildsPrecondition(options: FoxxieCommand.Options): void {
        if (options.allowedGuilds?.length) {
            this.preconditions.append({
                name: 'AllowedGuilds',
                context: { allowedGuilds: options.allowedGuilds }
            });
        }
    }

    public addPermissionLevels(options: FoxxieCommand.Options) {
        switch (options.permissionLevel) {
            case PermissionLevels.Everyone:
                this.preconditions.append('Everyone');
                break;
            case PermissionLevels.Moderator:
                this.preconditions.append('Moderator');
                break;
            case PermissionLevels.Administrator:
                this.preconditions.append('Administrator');
                break;
            case PermissionLevels.BotOwner:
                this.preconditions.append('BotOwner');
                break;
            default:
                this.preconditions.append('Everyone');
        }
    }

    public async messagePreParse(
        message: Message,
        parameters: string,
        context: MessageCommandContext
    ): Promise<FoxxieCommand.Args> {
        const parser = new Lexure.Parser(this.lexer.setInput(parameters).lex()).setUnorderedStrategy(this.strategy);
        const args = new Lexure.Args(parser.parse());
        const [t, color] = await Promise.all([
            this.container.db.guilds.acquire(message.guild!.id, settings => settings.getLanguage()),
            this.container.db.fetchColor(message)
        ]);

        return new FoxxieArgs(message, this, args, context, t, color);
    }

    protected parseConstructorPreConditions(options: FoxxieCommand.Options): void {
        super.parseConstructorPreConditions(options);
        this.addPermissionLevels(options);
        this.addAllowedGuildsPrecondition(options);
    }

    protected error(identifier: string | UserError, context?: unknown): never {
        throw typeof identifier === 'string' ? new UserError({ identifier, context }) : identifier;
    }

    public get category(): string | null {
        return this.fullCategory.length > 0 ? this.fullCategory[0] : null;
    }

    protected get client(): FoxxieClient {
        return this.container.client as FoxxieClient;
    }

    protected get db(): MongoDB {
        return this.container.db;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
// eslint-disable-next-line no-redeclare
export namespace FoxxieCommand {
    export type Options = SubCommandPluginCommand.Options & {
        guarded?: boolean;
        hidden?: boolean;
        spam?: boolean;
        usage?: string;
        allowedGuilds?: string[];
        permissionLevel?: PermissionLevels;
        detailedDescription?: CustomFunctionGet<
            string,
            {
                prefix: string;
            },
            DetailedDescription
        >;
    };

    export type Args = FoxxieArgs;
    export type Context = MessageCommandContext;
}

export type FoxxieCommandOptions = SubCommandPluginCommand.Options & {
    guarded?: boolean;
    hidden?: boolean;
    spam?: boolean;
    allowedGuilds?: string[];
    permissionLevel?: PermissionLevels;

    detailedDescription?: CustomFunctionGet<
        string,
        {
            prefix: string;
        },
        DetailedDescription
    >;
};
