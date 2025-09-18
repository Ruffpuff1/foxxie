import { PrismaClient } from '@prisma/client';
import { container } from '@sapphire/pieces';

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

export class PrismaDatabase {
	public static async sql<R, Q extends string = string>(query: (() => Q) | Q, variables: any[] = []): Promise<R> {
		const queryString = typeof query === 'function' ? query() : query;
		return container.prisma.$queryRaw(this.#toTemplateStringsArray(queryString.split('?')), ...variables) as R;
	}

	static #toTemplateStringsArray = (array: string[]): TemplateStringsArray => {
		const stringsArray: any = [...array];
		stringsArray.raw = array;
		return stringsArray as TemplateStringsArray;
	};
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: typeof prisma;
	}
}

interface GuildModerationMetadata {
	count: number;
	latest: number;
}
