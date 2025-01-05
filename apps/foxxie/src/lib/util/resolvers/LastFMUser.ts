import { container } from '@sapphire/pieces';
import { UserService } from '#apis/last.fm/index';
import { GuildMessage } from '#lib/types';
import { BotIds } from '#utils/constants';
import { ChatInputCommandInteraction } from 'discord.js';

import { resolveString } from './String.js';
import { resolveUsername } from './Username.js';

export async function resolveLastFMUser(context: ChatInputCommandInteraction | GuildMessage, parameter: null | string) {
	if (!parameter) {
		return resolveYouOrFoxxie(context);
	}

	const result = await resolveUsername(parameter, context.guild!);
	if (result.isOk()) {
		const resolvedByDiscordUser = await container.prisma.userLastFM.findFirst({
			include: { discogs: true, discogsReleases: true },
			where: { userid: result.unwrap().id }
		});
		if (resolvedByDiscordUser) return resolvedByDiscordUser;
	}

	const stringResult = resolveString(parameter);
	if (stringResult.isOk()) {
		const resolvedByString = await container.prisma.userLastFM.findFirst({
			include: { discogs: true, discogsReleases: true },
			where: { usernameLastFM: stringResult.unwrap().toLowerCase() }
		});
		if (resolvedByString) return resolvedByString;
	}

	return resolveYouOrFoxxie(context);
}

export async function resolveYouOrFoxxie(context: ChatInputCommandInteraction | GuildMessage) {
	const userid = context instanceof ChatInputCommandInteraction ? context.user.id : context.author.id;
	if (!userid) return resolveFoxxie();

	const resolvedByDiscordUser = await container.prisma.userLastFM.findFirst({
		include: { discogs: true, discogsReleases: true },
		where: { userid }
	});
	if (resolvedByDiscordUser) {
		void UserService.UpdateUserLastUsed(resolvedByDiscordUser.userid);
		return resolvedByDiscordUser;
	}

	return resolveFoxxie();
}

function resolveFoxxie() {
	void UserService.UpdateUserLastUsed(BotIds.Foxxie);
	return container.prisma.userLastFM.findFirst({ where: { usernameLastFM: 'foxxiebot' } }).then((user) => user!);
}
