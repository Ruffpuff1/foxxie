import { resolveToNull } from '@ruffpuff/utilities';
import { createClassDecorator, createFunctionPrecondition, createMethodDecorator, createProxy, DecoratorIdentifiers } from '@sapphire/decorators';
import { isDMChannel, isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { Command, RegisterBehavior, UserError } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { SubcommandMappingArray, SubcommandMappingMethod } from '@sapphire/plugin-subcommands';
import { Ctor, isNullish } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	PermissionResolvable,
	PermissionsBitField,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

const DMAvailableUserPermissions = new PermissionsBitField(
	~new PermissionsBitField([
		PermissionFlagsBits.AddReactions,
		PermissionFlagsBits.AttachFiles,
		PermissionFlagsBits.EmbedLinks,
		PermissionFlagsBits.ReadMessageHistory,
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.UseExternalEmojis,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.UseExternalStickers,
		PermissionFlagsBits.MentionEveryone
	]).bitfield & PermissionsBitField.All
);

export const RequiresLastFMUsername = (
	thrownError: string = LanguageKeys.Preconditions.LastFMLogin,
	userErrorOptions?: Omit<UserError.Options, 'identifier'>
): MethodDecorator => {
	return createFunctionPrecondition(
		async (message: ChatInputCommandInteraction | GuildMessage) => {
			const entity = await container.prisma.userLastFM.findFirst({ where: { userid: message.member?.user.id } });
			if (entity?.usernameLastFM) return true;
			return false;
		},
		() => {
			throw new UserError({ identifier: thrownError, ...userErrorOptions });
		}
	);
};

const SubcommandMapping = new Map<string, SubcommandMappingArray>();

export const MessageSubcommand = (methodName: string, isDefault = false, aliases: string[] = []) => {
	console.log('regis meth', aliases);
	return createMethodDecorator((target, __, descriptor) => {
		const messageRun = descriptor.value;
		const name = Reflect.get(target, 'name') || target.constructor.name;
		if (!name) return;

		console.log(name);

		const previous = SubcommandMapping.get(name);
		const options = { default: isDefault, name: methodName };

		if (previous) {
			const entry = previous.findIndex((s) => s.name === name);
			const returned = entry === -1 ? [options] : previous.splice(entry, 1);

			const newEntry = [...previous, { ...returned[0], default: isDefault, messageRun }] as SubcommandMappingArray;
			SubcommandMapping.set(name, newEntry);
		} else {
			SubcommandMapping.set(name, [{ default: isDefault, messageRun, name: methodName }] as SubcommandMappingArray);
		}
	});
};

export const RegisterSubcommand = (options: FoxxieSubcommand.Options = {}) => {
	console.log('regis cmd');
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				const subcommands = SubcommandMapping.get(ctor.name) || [];
				return new ctor(context, {
					...base,
					...options,
					subcommands: [...(base.subcommands || []), ...(options.subcommands || []), ...subcommands]
				});
			}
		});
	});
};

export const RequiresMemberPermissions = (...permissionsResolveable: PermissionResolvable[]): MethodDecorator => {
	const resolved = new PermissionsBitField(permissionsResolveable);
	const resolvedIncludesServerPermissions = Boolean(resolved.bitfield & DMAvailableUserPermissions.bitfield);
	return createFunctionPrecondition(async (context: ChatInputCommandInteraction | GuildMessage) => {
		const { channel } = context;

		if (resolvedIncludesServerPermissions && isDMChannel(channel)) {
			throw new UserError({
				identifier: DecoratorIdentifiers.RequiresUserPermissionsGuildOnly,
				message: 'Sorry, but that command can only be used in a server because you do not have sufficient permissions in DMs'
			});
		}

		const member = await resolveToNull(context.guild!.members.fetch(context.member!.user.id));

		if (isGuildBasedChannel(channel) && !isNullish(member)) {
			const missingPermissions = channel.permissionsFor(member).missing(resolved);
			if (missingPermissions.length) {
				throw new UserError({
					context: {
						count: missingPermissions.length,
						missing: missingPermissions
					},
					identifier: DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions /* RequiresUserPermissionsMissingPermissions */,
					message: `Sorry, but you are not allowed to do that. You are missing the permissions: ${missingPermissions}`
				});
			}
		}

		return true;
	});
};

export function RegisterChatInputSubcommandMethod(
	name: string,
	chatInputRun: SubcommandMappingMethod['chatInputRun'],
	options: Omit<SubcommandMappingMethod, 'chatInputRun'> = { name }
) {
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				const subcommands = (base.subcommands || []) as SubcommandMappingArray;

				const entry = subcommands.findIndex((s) => s.name === name);
				const returned = entry === -1 ? [options] : subcommands.splice(entry, 1);

				return new ctor(context, {
					...base,
					subcommands: [...subcommands, { ...returned[0], chatInputRun }]
				} as FoxxieSubcommand.Options);
			}
		});
	});
}

export function RegisterMessageSubcommandMethod(
	name: string,
	messageRun: SubcommandMappingMethod['messageRun'],
	options: { aliases?: string[] } & Partial<Omit<SubcommandMappingMethod, 'messageRun'>> = {}
) {
	const resolvedOptions = { default: options.default, name };
	const aliases = options.aliases || [];

	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				const subcommands = (base.subcommands || []) as SubcommandMappingArray;

				const entry = subcommands.findIndex((s) => s.name === name);
				const returned = entry === -1 ? [resolvedOptions] : subcommands.splice(entry, 1);

				const mappedAliases: SubcommandMappingArray = [];
				if (aliases.length) for (const alias of aliases) mappedAliases.push({ messageRun, name: alias });

				return new ctor(context, {
					...base,
					subcommands: [...subcommands, ...mappedAliases, { ...returned[0], default: resolvedOptions.default, messageRun }]
				} as FoxxieSubcommand.Options);
			}
		});
	});
}

export const RequiresStarboardEntries = (
	thrownError: string = 'preconditions:starboardNoEntries',
	userErrorOptions?: Omit<UserError.Options, 'identifier'>
): MethodDecorator => {
	return createFunctionPrecondition(
		async (message: GuildMessage) => {
			const entity = await container.prisma.starboard.findFirst({ where: { guildId: message.guild.id } });
			if (!entity) return false;
			return true;
		},
		() => {
			throw new UserError({ identifier: thrownError, ...userErrorOptions });
		}
	);
};

export function RegisterChatInputCommand(
	builder:
		| ((
				builder: SlashCommandBuilder
		  ) =>
				| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
				| SlashCommandBuilder
				| SlashCommandOptionsOnlyBuilder
				| SlashCommandSubcommandsOnlyBuilder)
		| SlashCommandBuilder,
	idHints: string[],
	options: Command.Options = {}
) {
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				const registry = container.applicationCommandRegistries.acquire(base.name);

				registry.registerChatInputCommand(builder, {
					behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
					idHints
				});

				return new ctor(context, {
					...base,
					...{
						...options
					}
				});
			}
		});
	});
}

export function RegisterFoxxieCommand() {
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				return new ctor(context, {
					...base
				});
			}
		});
	});
}
