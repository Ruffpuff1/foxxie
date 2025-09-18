import { createClassDecorator, createProxy } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Ctor } from '@sapphire/utilities';

import { FoxxieCommand } from './FoxxieCommand.js';

export const GuildOnlyCommand = () => {
	return createClassDecorator((command: Ctor) => {
		return createProxy(command, {
			construct: (ctor, [context, base = {}]) => {
				FoxxieCommand.GuildOnlyMap.set(ctor.name, true);

				return new ctor(context, {
					...base,
					runIn: [CommandOptionsRunTypeEnum.GuildAny]
				});
			}
		});
	});
};
