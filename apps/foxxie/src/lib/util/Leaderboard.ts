import { container } from '@sapphire/pieces';
import { minutes } from '#utils/common';
import { Collection } from 'discord.js';

export enum LeaderboardType {
	Local,
	Global
}

export interface LeaderboardUser {
	level: number;
	points: number;
	position: number;
}

interface LeaderboardPromises {
	guilds: Collection<string, Promise<void>>;
	users: null | Promise<void>;
}

interface LeaderboardTimeouts {
	guilds: Collection<string, NodeJS.Timeout>;
	users: NodeJS.Timeout | null;
}

export class Leaderboard {
	public static async Fetch(type: LeaderboardType, guild?: string): Promise<Collection<string, LeaderboardUser>> {
		if (guild && type === LeaderboardType.Local) {
			if (Leaderboard.Promises.guilds.has(guild)) {
				await Leaderboard.Promises.guilds.get(guild);
			} else if (!Leaderboard.Local.has(guild)) await Leaderboard.SyncMembers(guild);
			return Leaderboard.Local.get(guild)!;
		}
		return Leaderboard.Local.get(guild!)!;
	}

	private static async CreateMemberSync(guildId: string) {
		const { member } = container.prisma;
		const data = await member.findMany({
			orderBy: {
				level: 'desc'
			},
			take: 5000,
			where: {
				guildId,
				level: { gt: 1 }
			}
		});

		if (Leaderboard.Local.has(guildId)) Leaderboard.Local.get(guildId)!.clear();
		else Leaderboard.Local.set(guildId, new Collection());

		const store = Leaderboard.Local.get(guildId)!;
		let i = 0;

		for (const entry of data) {
			store.set(entry.userId, {
				level: entry.level,
				points: entry.points,
				position: ++i
			});
		}

		Leaderboard.Promises.guilds.delete(guildId);
	}

	private static async SyncMembers(guild: string) {
		if (Leaderboard.Promises.guilds.has(guild)) {
			clearTimeout(Leaderboard.Timeouts.guilds.get(guild)!);
		}

		const promise = new Promise<void>((resolve) => Leaderboard.CreateMemberSync(guild).then(resolve));

		Leaderboard.Promises.guilds.set(guild, promise);
		await promise;

		const timeout = setTimeout(() => {
			Leaderboard.Timeouts.guilds.delete(guild);
			Leaderboard.Local.get(guild)?.clear();
			Leaderboard.Local.delete(guild);
		}, minutes(10));

		Leaderboard.Timeouts.guilds.set(guild, timeout);
	}

	public static Local = new Collection<string, Collection<string, LeaderboardUser>>();

	private static readonly Promises: LeaderboardPromises = {
		guilds: new Collection(),
		users: null
	};

	private static Timeouts: LeaderboardTimeouts = {
		guilds: new Collection(),
		users: null
	};
}
