import { createMethodDecorator } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum, container } from '@sapphire/framework';
import { envParseBoolean } from '@skyra/env-utilities';
import { decoratedCommandOptions, decoratedRunMethods, TextCommand } from '#Foxxie/Core';
import { clientOwners } from '#root/config';
import { TextCommandBuilder } from '#root/Core/structures/TextCommandBuilder';
import { seconds } from '#utils/common';

export const Command = (options: ((builder: TextCommandBuilder) => TextCommandBuilder) | TextCommand.Options) => {
	const resolvedOptions = typeof options === 'function' ? options(new TextCommandBuilder()).setCategory('audio').toJSON() : options;

	return createMethodDecorator((_, prop, desc) => {
		const parsedOptions = {
			cooldownDelay: seconds(5),
			cooldownFilteredUsers: clientOwners,
			cooldownLimit: 2,
			enabled: envParseBoolean('AUDIO_ENABLED', false),
			generateDashLessAliases: true,
			name: String(resolvedOptions.name || prop).toLowerCase(),
			runIn: [CommandOptionsRunTypeEnum.GuildAny],
			...Object.fromEntries(Object.entries(resolvedOptions).filter(([, value]) => value !== undefined))
		} as TextCommand.Options;

		decoratedCommandOptions.set(parsedOptions.name!, parsedOptions);
		decoratedRunMethods.set(parsedOptions.name!, desc.value as TextCommand['messageRun']);

		void container.stores.loadPiece({
			name: parsedOptions.name!,
			piece: TextCommand,
			store: 'textcommands'
		});
	});
};
