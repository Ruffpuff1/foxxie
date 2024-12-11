import { PrismaClient } from '@prisma/client';
import { container } from '@sapphire/framework';

const prisma = new PrismaClient().$extends({
	model: {
		moderation: {
			async getGuildModerationMetadata(guildId: string): Promise<GuildModerationMetadata> {
				const [entry] = await prisma.$queryRaw<{ count: bigint; latest: null | number }[]>`
					SELECT
						MAX(case_id) as "latest",
						COUNT(*) as "count"
					FROM public.moderation
					WHERE guild_id = ${guildId};
				`;

				return { count: Number(entry.count), latest: entry.latest ?? 0 };
			}
		}
	},
	name: 'extensions'
});
container.prisma = prisma;

declare module '@sapphire/pieces' {
	interface Container {
		prisma: typeof prisma;
	}
}

interface GuildModerationMetadata {
	count: number;
	latest: number;
}
