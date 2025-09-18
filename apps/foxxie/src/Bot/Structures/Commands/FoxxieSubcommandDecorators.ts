import { createClassDecorator, createMethodDecorator, createProxy } from '@sapphire/decorators';
import { RegisterBehavior } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { SubcommandMapping, SubcommandMappingArray } from '@sapphire/plugin-subcommands';
import { Ctor } from '@sapphire/utilities';
import {
	ChatInputApplicationCommandData,
	InteractionContextType,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

import { FoxxieCommand } from './FoxxieCommand.js';
import { FoxxieSubcommand } from './FoxxieSubcommand.js';

export const RegisterSubcommand = (
	options: FoxxieSubcommand.Options,
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
				const subcommands = FoxxieSubcommand.MappedSubcommands.get(ctor.name) || [];

				if (builder) {
					const subcommandData = FoxxieSubcommand.SubcommandBuilderData.get(ctor.name);
					const guildOnly = FoxxieCommand.GuildOnlyMap.get(ctor.name);

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

				return new ctor(context, {
					...base,
					...options,
					subcommands: [...(base.subcommands || []), ...(options.subcommands || []), ...subcommands]
				});
			}
		});
	});
};

export const MessageSubcommand = (methodName: string, isDefault = false, aliases: string[] = []) => {
	return createMethodDecorator((target, __, descriptor) => {
		const messageRun = descriptor.value;
		const name = Reflect.get(target, 'name') || target.constructor.name;
		if (!name) return;

		const previous = FoxxieSubcommand.MappedSubcommands.get(name);
		const options = { default: isDefault, name: methodName };

		if (previous) {
			const entry = previous.findIndex((s) => s.name === methodName);
			const returned = entry === -1 ? [options] : previous.splice(entry, 1);

			const mappedAliases: SubcommandMappingArray = [];
			if (aliases.length) for (const alias of aliases) mappedAliases.push({ messageRun, name: alias } as SubcommandMapping);

			const newEntry = [...previous, ...mappedAliases, { ...returned[0], default: isDefault, messageRun }] as SubcommandMappingArray;
			FoxxieSubcommand.MappedSubcommands.set(name, newEntry);
		} else {
			const mappedAliases: SubcommandMappingArray = [];
			if (aliases.length) for (const alias of aliases) mappedAliases.push({ messageRun, name: alias } as SubcommandMapping);
			FoxxieSubcommand.MappedSubcommands.set(name, [
				...mappedAliases,
				{ default: isDefault, messageRun, name: methodName }
			] as SubcommandMappingArray);
		}
	});
};
