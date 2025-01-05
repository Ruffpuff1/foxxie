import { resolveToNull } from '@ruffpuff/utilities';
import { createClassDecorator, createFunctionPrecondition, createMethodDecorator, createProxy, DecoratorIdentifiers } from '@sapphire/decorators';
import { isDMChannel, isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { CommandOptionsRunTypeEnum, Listener, RegisterBehavior, Command as SapphireCommand, UserError } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { SubcommandMapping, SubcommandMappingArray, SubcommandMappingMethod } from '@sapphire/plugin-subcommands';
import { Ctor, isNullish } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/structures';
import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { GuildMessage } from '#lib/types';
import { EventBuilder } from '#root/Core/structures/EventBuilder';
import { TaskBuilder } from '#root/Core/structures/TaskBuilder';
import { TextCommandBuilder } from '#root/Core/structures/TextCommandBuilder';
import {
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	InteractionContextType,
	PermissionFlagsBits,
	PermissionResolvable,
	PermissionsBitField,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

import { Schedules } from './constants.js';

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

const MappedSubcommands = new Map<string, SubcommandMappingArray>();
const SubcommandBuilderData = new Map<string, SlashCommandSubcommandBuilder[]>();

export const ChatInputSubcommand = (methodName: string, builder: (builder: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder) => {
	return createMethodDecorator((target, __, descriptor) => {
		const chatInputRun = descriptor.value;
		const name = Reflect.get(target, 'name') || target.constructor.name;
		if (!name) return;

		const previousBuilders = SubcommandBuilderData.get(name);
		if (previousBuilders) {
			const newNode = [...previousBuilders, builder(new SlashCommandSubcommandBuilder())];
			SubcommandBuilderData.set(name, newNode);
		} else {
			SubcommandBuilderData.set(name, [builder(new SlashCommandSubcommandBuilder())]);
		}

		const previous = MappedSubcommands.get(name);
		const options = { name: methodName };

		if (previous) {
			const entry = previous.findIndex((s) => s.name === name);
			const returned = entry === -1 ? [options] : previous.splice(entry, 1);

			const newEntry = [...previous, { ...returned[0], chatInputRun }] as SubcommandMappingArray;
			MappedSubcommands.set(name, newEntry);
		} else {
			MappedSubcommands.set(name, [{ chatInputRun, name: methodName }] as SubcommandMappingArray);
		}

		if (!chatInputRun) throw 'no method';
		if (typeof chatInputRun !== 'function') throw 'not a method';

		descriptor.value = async function value(this: any, ...args: any[]) {
			return chatInputRun!.call(this, ...args);
		} as unknown as undefined;
	});
};

export const ProductionOnly = (on: boolean = true) => {
	return createMethodDecorator((_, __, descriptor) => {
		const run = descriptor.value;

		if (!run) throw 'no method';
		if (typeof run !== 'function') throw 'not a method';

		descriptor.value = async function value(this: any, ...args: any[]) {
			const enabled = container.client.enabledProdOnlyEvent();

			if (!enabled && on) return;
			return run!.call(this, ...args);
		} as unknown as undefined;
	});
};

export const TypingEnabled = () => {
	return createMethodDecorator((_, __, descriptor) => {
		const run = descriptor.value;

		if (!run) throw 'no method';
		if (typeof run !== 'function') throw 'not a method';

		descriptor.value = async function value(this: any, ...args: any[]) {
			const enabled = container.client.options.typing ?? false;

			if (!enabled) return;
			return run!.call(this, ...args);
		} as unknown as undefined;
	});
};

export const MessageSubcommand = (methodName: string, isDefault = false, aliases: string[] = []) => {
	return createMethodDecorator((target, __, descriptor) => {
		const messageRun = descriptor.value;
		const name = Reflect.get(target, 'name') || target.constructor.name;
		if (!name) return;

		const previous = MappedSubcommands.get(name);
		const options = { default: isDefault, name: methodName };

		if (previous) {
			const entry = previous.findIndex((s) => s.name === methodName);
			const returned = entry === -1 ? [options] : previous.splice(entry, 1);

			const mappedAliases: SubcommandMappingArray = [];
			if (aliases.length) for (const alias of aliases) mappedAliases.push({ messageRun, name: alias } as SubcommandMapping);

			const newEntry = [...previous, ...mappedAliases, { ...returned[0], default: isDefault, messageRun }] as SubcommandMappingArray;
			MappedSubcommands.set(name, newEntry);
		} else {
			const mappedAliases: SubcommandMappingArray = [];
			if (aliases.length) for (const alias of aliases) mappedAliases.push({ messageRun, name: alias } as SubcommandMapping);
			MappedSubcommands.set(name, [...mappedAliases, { default: isDefault, messageRun, name: methodName }] as SubcommandMappingArray);
		}
	});
};

const guildOnlyMap = new Map<string, boolean>();

export const RegisterButtonHandler = (handler: FoxxieButtonInteractionHandler.Handler) => {
	return createClassDecorator((buttonHandler: Ctor) => {
		return createProxy(buttonHandler, {
			construct: (ctor, [context, base = {}]) => {
				return new ctor(context, {
					...base,
					handler,
					key: handler.name.toLowerCase()
				});
			}
		});
	});
};

export const RegisterListener = (listener: ((builder: EventBuilder) => EventBuilder) | Listener.Options) => {
	return createClassDecorator((buttonHandler: Ctor) => {
		return createProxy(buttonHandler, {
			construct: (ctor, [context, base = {}]) => {
				const resolvedOptions = typeof listener === 'function' ? listener(new EventBuilder()).toJSON() : listener;
				return new ctor(context, {
					...base,
					...resolvedOptions
				});
			}
		});
	});
};

export const RegisterCron = (cron: string) => {
	return createClassDecorator((task: Ctor) => {
		return createProxy(task, {
			construct: (ctor, [context, base = {}]) => {
				return new ctor(context, {
					...base,
					cron
				});
			}
		});
	});
};

export const ProductionOnlyPiece = (enable?: boolean) => {
	return createClassDecorator((piece: Ctor) => {
		return createProxy(piece, {
			construct: (ctor, [context, base = {}]) => {
				return new ctor(context, {
					...base,
					enabled: enable === false ? base.enabled : container.client.enabledProdOnlyEvent()
				});
			}
		});
	});
};

export const RegisterTask = (task: ((builder: TaskBuilder) => TaskBuilder) | Schedules) => {
	return createClassDecorator((buttonHandler: Ctor) => {
		return createProxy(buttonHandler, {
			construct: (ctor, [context, base = {}]) => {
				const resolvedOptions = typeof task === 'function' ? task(new TaskBuilder()).toJSON() : { name: task };
				return new ctor(context, {
					...base,
					...resolvedOptions
				});
			}
		});
	});
};

export const RegisterCommand = (
	options: ((builder: TextCommandBuilder) => TextCommandBuilder) | FoxxieSubcommand.Options,
	builder?:
		| ((
				builder: SlashCommandBuilder
		  ) =>
				| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
				| SlashCommandBuilder
				| SlashCommandOptionsOnlyBuilder
				| SlashCommandSubcommandsOnlyBuilder)
		| SlashCommandBuilder,
	idHints: string[] = []
) => {
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				if (builder) {
					const guildOnly = guildOnlyMap.get(ctor.name);

					const builderData = (typeof builder === 'function' ? builder(new SlashCommandBuilder()) : builder).toJSON();
					const combined = {
						...builderData
					};

					if (guildOnly) combined.contexts = [...(combined.contexts || []), InteractionContextType.Guild];

					const registry = container.applicationCommandRegistries.acquire(base.name);

					registry.registerChatInputCommand(combined as ChatInputApplicationCommandData, {
						behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
						idHints
					});
				}

				const resolvedOptions = typeof options === 'function' ? options(new TextCommandBuilder()).toJSON() : options;

				return new ctor(context, {
					...base,
					...resolvedOptions
				});
			}
		});
	});
};

export const RegisterSubcommand = (
	options: ((builder: TextCommandBuilder) => TextCommandBuilder) | FoxxieSubcommand.Options,
	builder?:
		| ((
				builder: SlashCommandBuilder
		  ) =>
				| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
				| SlashCommandBuilder
				| SlashCommandOptionsOnlyBuilder
				| SlashCommandSubcommandsOnlyBuilder)
		| SlashCommandBuilder,
	idHints: string[] = []
) => {
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				const subcommands = MappedSubcommands.get(ctor.name) || [];

				if (builder) {
					const subcommandData = SubcommandBuilderData.get(ctor.name);
					const guildOnly = guildOnlyMap.get(ctor.name);

					const builderData = (typeof builder === 'function' ? builder(new SlashCommandBuilder()) : builder).toJSON();
					const combined = {
						...builderData,
						options: [...(builderData.options || []), ...(subcommandData || []).map((s) => s.toJSON())]
					};

					if (guildOnly) combined.contexts = [...(combined.contexts || []), InteractionContextType.Guild];

					const registry = container.applicationCommandRegistries.acquire(base.name);

					registry.registerChatInputCommand(combined as ChatInputApplicationCommandData, {
						behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
						idHints
					});
				}

				const resolvedOptions = typeof options === 'function' ? options(new TextCommandBuilder()).toJSON() : options;

				return new ctor(context, {
					...base,
					...resolvedOptions,
					subcommands: [...(base.subcommands || []), ...(resolvedOptions.subcommands || []), ...subcommands]
				});
			}
		});
	});
};

export const GuildOnlyCommand = () => {
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				guildOnlyMap.set(ctor.name, true);

				return new ctor(context, {
					...base,
					runIn: [CommandOptionsRunTypeEnum.GuildAny]
				});
			}
		});
	});
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
	options: SapphireCommand.Options = {}
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
