import { container } from '@sapphire/framework';
import { GuildMessage } from '#lib/types';
import { ChatInputCommandInteraction } from 'discord.js';

import { resolveString } from './String.js';
import { resolveUsername } from './Username.js';

export async function resolveLastFMUser(context: ChatInputCommandInteraction | GuildMessage, parameter: null | string) {
	if (!parameter) {
		return resolveYouOrFoxxie(context);
	}

	const result = await resolveUsername(parameter, context.guild!);
	if (result.isOk()) {
		const resolvedByDiscordUser = await container.prisma.userLastFM.findFirst({ where: { userid: result.unwrap().id } });
		if (resolvedByDiscordUser) return resolvedByDiscordUser;
	}

	const stringResult = resolveString(parameter);
	if (stringResult.isOk()) {
		const resolvedByString = await container.prisma.userLastFM.findFirst({ where: { usernameLastFM: stringResult.unwrap().toLowerCase() } });
		if (resolvedByString) return resolvedByString;
	}

	return resolveYouOrFoxxie(context);
}

export async function resolveYouOrFoxxie(context: ChatInputCommandInteraction | GuildMessage) {
	const userid = context instanceof ChatInputCommandInteraction ? context.user.id : context.author.id;
	if (!userid) return resolveFoxxie();

	const resolvedByDiscordUser = await container.prisma.userLastFM.findFirst({
		where: { userid }
	});
	if (resolvedByDiscordUser) return resolvedByDiscordUser;

	return resolveFoxxie();
}

function resolveFoxxie() {
	return container.prisma.userLastFM.findFirst({ where: { usernameLastFM: 'foxxiebot' } }).then((user) => user!);
}
