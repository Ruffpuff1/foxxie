// import { GuildSettings, ModerationEntity, acquireSettings } from '#lib/Database';
// import { LanguageKeys } from '#lib/I18n';
// import { CustomFunctionGet, GuildMessage, PermissionLevels } from '#lib/Types';
// import { isGuildOwner, sendTemporaryMessage } from '#utils/Discord';
// import type { SendOptions } from '#utils/moderation';
// import { bold } from '@discordjs/builders';
// import { cast, minutes, seconds, years } from '@ruffpuff/utilities';
// import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
// import { PermissionFlagsBits, type GuildMember, type User } from 'discord.js';
// import { FoxxieCommand } from '../commands';
// import { TFunction } from 'i18next';

// export abstract class ModerationCommand<T = unknown> extends FoxxieCommand {
//     /**
//      * Whether a member is required or not.
//      */
//     protected memberOnly: boolean;

//     /**
//      * Whether or not this command can be temporary.
//      */
//     protected duration: boolean;

//     /**
//      * The language key for when the command is a success.
//      */
//     protected successKey: string;

//     public constructor(context: FoxxieCommand.LoaderContext, options: ModerationCommand.Options) {
//         super(context, {
//             cooldownDelay: seconds(5),
//             flags: ['no-author', 'authored', 'no-dm', 'dm'],
//             duration: false,
//             memberOnly: false,
//             runIn: [CommandOptionsRunTypeEnum.GuildAny],
//             permissionLevel: PermissionLevels.Moderator,
//             ...options
//         });

//         this.memberOnly = options.memberOnly!;
//         this.duration = options.duration!;
//         this.successKey = options.successKey;
//     }

//     public messageRun(
//         message: GuildMessage,
//         args: ModerationCommand.Args,
//         context: ModerationCommand.Context
//     ): Promise<void>;

//     public async messageRun(message: GuildMessage, args: ModerationCommand.Args): Promise<void> {
//         const resolved = await this.messageResolveTargets(args);
//         const preHandled = await this.messagePrehandle(message, resolved);
//         const processed = cast<Array<{ log: ModerationEntity; target: User }>>([]);
//         const errors = cast<Array<{ error: Error | string; target: User }>>([]);

//         const { targets, ...handledRaw } = resolved;
//         const logChannelId = await acquireSettings(message.guild, s => s.channels[GuildSettings.Channels.Logs.Moderation]);

//         for (const target of new Set(targets)) {
//             try {
//                 const handled = { ...handledRaw, args, target, preHandled, t: args.t };
//                 await this.messageCheckModeratable(message, handled);
//                 const log = await this.messageHandle(message, handled);
//                 processed.push({ log, target });
//             } catch (error) {
//                 errors.push({ error: cast<Error | string>(error), target });
//             }
//         }

//         try {
//             await this.messagePosthandle(message, { ...resolved, preHandled });
//         } catch {
//             // noop
//         }

//         const output: string[] = [];

//         if (processed.length) {
//             const firstLog = processed[0].log;
//             const logReason = firstLog.reason!;
//             const sorted = processed.sort((a, b) => a.log.caseId - b.log.caseId);
//             const cases = sorted.map(({ log }) => log.caseId);
//             const users = sorted.map(({ target }) => bold(target.username));
//             const range = cases.length === 1 ? cases[0] : `${cases[0]}..${cases[cases.length - 1]}`;

//             const formattedRange = logChannelId
//                 ? `[${range}](<https://discord.com/channels/${firstLog.guildId}/${logChannelId}>)`
//                 : range;

//             output.push(args.t(this.successKey, { users, range: formattedRange, count: cases.length }));
//             if (logReason) output.push(`└── *"${logReason}"*`);
//         }

//         if (errors.length) {
//             output.push(
//                 args.t(LanguageKeys.Listeners.Errors.ModerationHasError, { count: [...errors, ...processed].length })
//             );
//             for (const e of errors) output.push(`└── ${e.error}`);
//         }

//         if (output.length) await sendTemporaryMessage(message, output.join('\n'), minutes(5));
//     }

//     public chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void>;

//     public async chatInputRun(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<void> {
//         const resolved = this.chatInputResolveTargets(interaction);
//         const preHandled = await this.chatInputPrehandle(interaction, resolved);
//         const processed = cast<Array<{ log: ModerationEntity; target: User }>>([]);
//         const errors = cast<Array<{ error: Error | string; target: User }>>([]);

//         const { targets, ...handledRaw } = resolved;
//         const [t, logChannelId] = await acquireSettings(interaction.guild, s => [
//             s.getLanguage(),
//             s.channels[GuildSettings.Channels.Logs.Moderation]
//         ]);

//         const ephemeral = interaction.options.getBoolean('hidden') || false;

//         for (const target of new Set(targets)) {
//             try {
//                 const handled = { ...handledRaw, target, preHandled, t };
//                 await this.chatInputCheckModeratable(interaction, handled);
//                 const log = await this.chatInputHandle(interaction, handled);
//                 processed.push({ log, target });
//             } catch (error) {
//                 errors.push({ error: cast<Error | string>(error), target });
//             }
//         }

//         try {
//             await this.chatInputPosthandle(interaction, { ...resolved, preHandled });
//         } catch {
//             // noop
//         }

//         const output: string[] = [];

//         await interaction.deferReply({ ephemeral });

//         if (processed.length) {
//             const firstLog = processed[0].log;
//             const logReason = firstLog.reason!;
//             const sorted = processed.sort((a, b) => a.log.caseId - b.log.caseId);
//             const cases = sorted.map(({ log }) => log.caseId);
//             const users = sorted.map(({ target }) => bold(target.username));
//             const range = cases.length === 1 ? cases[0] : `${cases[0]}..${cases[cases.length - 1]}`;

//             const formattedRange = logChannelId
//                 ? `[${range}](<https://discord.com/channels/${firstLog.guildId}/${logChannelId}>)`
//                 : range;

//             output.push(t(this.successKey, { users, range: formattedRange, count: cases.length }));
//             if (logReason) output.push(`└── *"${logReason}"*`);
//         }

//         if (errors.length) {
//             output.push(t(LanguageKeys.Listeners.Errors.ModerationHasError, { count: [...errors, ...processed].length }));
//             for (const e of errors) output.push(`└── ${e.error}`);
//         }

//         if (output.length) await interaction.editReply({ content: output.join('\n') });
//     }

//     protected async messageCheckModeratable(
//         message: GuildMessage,
//         context: HandledCommandContext<T>
//     ): Promise<GuildMember | null> {
//         if (context.target.id === message.author.id) {
//             throw context.args.t(LanguageKeys.Listeners.Errors.ModerationSelf, {
//                 target: `**${context.target.username}**`
//             });
//         }

//         if (context.target.id === process.env.CLIENT_ID) {
//             throw context.args.t(LanguageKeys.Listeners.Errors.ModerationFoxxie, {
//                 target: `**${context.target.username}**`
//             });
//         }

//         const member = await message.guild.members.fetch(context.target.id).catch(() => {
//             if (this.memberOnly)
//                 throw context.args.t(LanguageKeys.Listeners.Errors.ModerationMember, {
//                     target: `**${context.target.username}**`
//                 });
//             return null;
//         });

//         if (member) {
//             const targetRolePos = member.roles.highest.position;
//             const { maybeMe } = this.container.utilities.guild(message.guild);
//             const myRolePos = maybeMe?.roles.highest.position;

//             if (!myRolePos || (targetRolePos >= myRolePos && !maybeMe.permissions.has(PermissionFlagsBits.Administrator))) {
//                 throw context.args.t(LanguageKeys.Listeners.Errors.ModerationRoleBot, {
//                     target: `**${context.target.username}**`
//                 });
//             }

//             const mod = message.guild.members.cache.get(message.author.id);
//             const modRolePosition = mod?.roles.highest.position;

//             // A member who isn't a server owner is not allowed to moderate somebody with higher role than them:
//             if (!mod || !modRolePosition || (!isGuildOwner(mod) && targetRolePos >= modRolePosition)) {
//                 throw context.args.t(LanguageKeys.Listeners.Errors.ModerationRole, {
//                     target: `**${context.target.username}**`
//                 });
//             }
//         }

//         return member;
//     }

//     protected async chatInputCheckModeratable(
//         interaction: FoxxieCommand.ChatInputCommandInteraction,
//         context: Omit<HandledCommandContext<T>, 'args'>
//     ): Promise<GuildMember | null> {
//         if (context.target.id === interaction.user.id) {
//             throw context.t(LanguageKeys.Listeners.Errors.ModerationSelf, { target: `**${context.target.username}**` });
//         }

//         if (context.target.id === process.env.CLIENT_ID) {
//             throw context.t(LanguageKeys.Listeners.Errors.ModerationFoxxie, {
//                 target: `**${context.target.username}**`
//             });
//         }

//         const member = await interaction.guild.members.fetch(context.target.id).catch(() => {
//             if (this.memberOnly)
//                 throw context.t(LanguageKeys.Listeners.Errors.ModerationMember, {
//                     target: `**${context.target.username}**`
//                 });
//             return null;
//         });

//         if (member) {
//             const targetRolePos = member.roles.highest.position;
//             const { maybeMe } = this.container.utilities.guild(member);
//             const myRolePos = maybeMe?.roles.highest.position;

//             if (!myRolePos || (targetRolePos >= myRolePos && !maybeMe.permissions.has(PermissionFlagsBits.Administrator))) {
//                 throw context.t(LanguageKeys.Listeners.Errors.ModerationRoleBot, {
//                     target: `**${context.target.username}**`
//                 });
//             }

//             const mod = interaction.guild.members.cache.get(interaction.user.id);
//             const modRolePosition = mod?.roles.highest.position;

//             // A member who isn't a server owner is not allowed to moderate somebody with higher role than them:
//             if (!mod || !modRolePosition || (!isGuildOwner(mod) && targetRolePos >= modRolePosition)) {
//                 throw context.t(LanguageKeys.Listeners.Errors.ModerationRole, {
//                     target: `**${context.target.username}**`
//                 });
//             }
//         }

//         return member;
//     }

//     protected async messageResolveTargets(args: ModerationCommand.Args): Promise<CommandContext> {
//         return {
//             targets: await args.repeat('user', { times: 10 }),
//             duration: await this.resolveDuration(args),
//             reason: args.finished ? null : await args.rest('string')
//         };
//     }

//     protected chatInputResolveTargets(interaction: FoxxieCommand.ChatInputCommandInteraction): CommandContext {
//         return {
//             targets: [interaction.options.getUser('user', true)],
//             duration: null,
//             reason: interaction.options.getString('reason') || null
//         };
//     }

//     protected async messageGetDmData(message: GuildMessage, context: HandledCommandContext): Promise<SendOptions> {
//         return {
//             send: context.args.getFlags('no-dm')
//                 ? false
//                 : context.args.getFlags('dm') ||
//                   (await this.container.db.guilds.acquire(message.guild.id, GuildSettings.Moderation.Dm))
//         };
//     }

//     protected async chatInputGetDmData(interaction: FoxxieCommand.ChatInputCommandInteraction): Promise<SendOptions> {
//         const noDm = interaction.options.getBoolean('no-dm') || false;
//         const dm = interaction.options.getBoolean('dm') || undefined;

//         return {
//             send: noDm
//                 ? false
//                 : dm || (await this.container.db.guilds.acquire(interaction.guildId, GuildSettings.Moderation.Dm))
//         };
//     }

//     protected chatInputGetDays(interaction: FoxxieCommand.ChatInputCommandInteraction) {
//         return interaction.options.getNumber('days') || 0;
//     }

//     protected messagePrehandle(_message: GuildMessage, _context: CommandContext): Promise<T> | T {
//         return cast<T>(null);
//     }

//     protected messagePosthandle(_message: GuildMessage, _context: PostHandledCommandContext<T>): unknown {
//         return null;
//     }

//     protected chatInputPrehandle(
//         _interaction: FoxxieCommand.ChatInputCommandInteraction,
//         _context: CommandContext
//     ): Promise<T> | T {
//         return cast<T>(null);
//     }

//     protected chatInputPosthandle(
//         _interaction: FoxxieCommand.ChatInputCommandInteraction,
//         _context: PostHandledCommandContext<T>
//     ): unknown {
//         return null;
//     }

//     protected abstract messageHandle(
//         message: GuildMessage,
//         context: HandledCommandContext<T>
//     ): Promise<ModerationEntity> | ModerationEntity;

//     protected abstract chatInputHandle(
//         message: FoxxieCommand.ChatInputCommandInteraction,
//         context: Omit<HandledCommandContext<T>, 'args'>
//     ): Promise<ModerationEntity> | ModerationEntity;

//     private async resolveDuration(args: ModerationCommand.Args) {
//         if (args.finished) return null;
//         if (!this.duration) return null;

//         const result = await args.pickResult('timespan', { minimum: 0, maximum: years(5) });
//         if (result.isOk()) return result.unwrap();
//         if (result.unwrapErr().identifier === LanguageKeys.Arguments.Duration) return null;
//         throw result.unwrapErr();
//     }
// }

// // eslint-disable-next-line no-redeclare
// export namespace ModerationCommand {
//     export interface Options extends FoxxieCommand.Options {
//         duration?: boolean;
//         memberOnly?: boolean;
//         successKey: CustomFunctionGet<
//             string,
//             {
//                 users: string[];
//                 range: string | number;
//                 count: number;
//             },
//             string
//         >;
//     }

//     export type Args = FoxxieCommand.Args;
//     export type Context = FoxxieCommand.Context;
//     export type ChatInputContext = FoxxieCommand.ChatInputContext;
// }

// export interface CommandContext {
//     targets: User[];
//     duration: number | null;
//     reason: string | null;
// }

// export interface HandledCommandContext<T = unknown> extends Pick<CommandContext, 'duration' | 'reason'> {
//     args: ModerationCommand.Args;
//     t: TFunction;
//     target: User;
//     preHandled: T;
// }

// export interface PostHandledCommandContext<T = unknown> extends CommandContext {
//     preHandled: T;
// }
