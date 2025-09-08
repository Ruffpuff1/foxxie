import { createMethodDecorator } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum, container, RegisterBehavior } from '@sapphire/framework';
import { clientOwners } from '#root/config';
import { seconds } from '#utils/common';
import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

import { TextCommand } from './TextCommand.js';
import { TextCommandBuilder } from './TextCommandBuilder.js';

export const decoratedCommandOptions = new Map<string, TextCommand.Options>();
export const decoratedRunMethods = new Map<string, TextCommand['messageRun']>();
export const decoratedChatInputRunMethods = new Map<string, TextCommand['chatInputRun']>();

export const Command = (options: ((builder: TextCommandBuilder) => TextCommandBuilder) | TextCommand.Options) => {
	const resolvedOptions = typeof options === 'function' ? options(new TextCommandBuilder()).toJSON() : options;

	return createMethodDecorator((_, prop, descriptor) => {
		const parsedOptions = {
			cooldownDelay: seconds(5),
			cooldownFilteredUsers: clientOwners,
			cooldownLimit: 2,
			generateDashLessAliases: true,
			name: String(resolvedOptions.name || prop).toLowerCase(),
			runIn: [CommandOptionsRunTypeEnum.GuildAny],
			...Object.fromEntries(Object.entries(resolvedOptions).filter(([, value]) => value !== undefined))
		} as TextCommand.Options;

		decoratedCommandOptions.set(parsedOptions.name!, parsedOptions);
		decoratedRunMethods.set(parsedOptions.name!, descriptor.value as TextCommand['messageRun']);

		void container.stores.loadPiece({
			name: parsedOptions.name!,
			piece: TextCommand,
			store: 'textcommands'
		});

		const run = descriptor.value;

		if (!run) throw 'no method';
		if (typeof run !== 'function') throw 'not a method';

		descriptor.value = async function value(this: any, ...args: any[]) {
			return run!.call(this, ...args);
		} as unknown as undefined;
	});
};

export const ChatInput = (
	builder:
		| ((
				builder: SlashCommandBuilder
		  ) =>
				| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
				| SlashCommandBuilder
				| SlashCommandOptionsOnlyBuilder
				| SlashCommandSubcommandsOnlyBuilder)
		| SlashCommandBuilder,
	idHints: string[]
) => {
	return createMethodDecorator((_, ___, descriptor) => {
		const constructed = typeof builder === 'function' ? builder(new SlashCommandBuilder()) : builder;
		const { name } = constructed;
		console.log(constructed);

		const registry = container.applicationCommandRegistries.acquire(name);
		registry.registerChatInputCommand(builder, {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			idHints
		});

		decoratedChatInputRunMethods.set(name, descriptor.value as TextCommand['chatInputRun']);

		const run = descriptor.value;

		if (!run) throw 'no method';
		if (typeof run !== 'function') throw 'not a method';

		descriptor.value = async function value(this: any, ...args: any[]) {
			return run!.call(this, ...args);
		} as unknown as undefined;
	});
};
