import { UserLastFM } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { Constants, GuildMessage } from '#Resources';
import { ChatInputCommandInteraction } from 'discord.js';

export class UserService {
	public static CacheKey(userNameLastFm: string) {
		return `user-${userNameLastFm}`;
	}

	public static ParseCachedUserResponse(str: null | string | undefined): null | UserLastFM {
		if (!str) return null;
		const parsed = JSON.parse(str) as UserLastFM;

		parsed.lastIndexed = parsed.lastIndexed ? new Date(parsed.lastIndexed) : null!;
		parsed.lastSmallIndexed = parsed.lastSmallIndexed ? new Date(parsed.lastSmallIndexed) : null;
		parsed.lastUsed = parsed.lastUsed ? new Date(parsed.lastUsed) : null;
		parsed.registeredLastFM = parsed.registeredLastFM ? new Date(parsed.registeredLastFM) : null;

		return parsed;
	}

	public static async ResolveFoxxie() {
		void UserService.UpdateUserLastUsed(Constants.BotIds.Foxxie);
		return container.prisma.userLastFM.findFirst({ where: { usernameLastFM: 'foxxiebot' } }).then((user) => user!);
	}

	public static async ResolveYouOrFoxxie(context: ChatInputCommandInteraction | GuildMessage) {
		const userId = context instanceof ChatInputCommandInteraction ? context.user.id : context.author.id;
		if (!userId) return UserService.ResolveFoxxie();

		const resolvedByDiscordUser = await container.prisma.userLastFM.findFirst({
			include: { discogs: true, discogsReleases: true },
			where: { userid: userId }
		});
		if (resolvedByDiscordUser) {
			void UserService.UpdateUserLastUsed(resolvedByDiscordUser.userid);
			return resolvedByDiscordUser;
		}

		return UserService.ResolveFoxxie();
	}

	public static async UpdateUserLastUsed(discordId: string) {
		const user = await container.prisma.userLastFM.findFirst({
			where: { userid: discordId }
		});

		if (user) {
			try {
				await container.prisma.userLastFM.update({
					data: {
						lastUsed: new Date()
					},
					where: {
						userid: discordId
					}
				});
			} catch {}
		}
	}
}
