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
	public constructor(private connection: typeof prisma) {}

	public async sql<R, Q extends string = string>(query: (() => Q) | Q, variables: any[] = []): Promise<R> {
		const queryString = typeof query === 'function' ? query() : query;
		return this.connection.$queryRaw(this.#toTemplateStringsArray(queryString.split('?')), ...variables) as R;
	}

	#toTemplateStringsArray = (array: string[]): TemplateStringsArray => {
		const stringsArray: any = [...array];
		stringsArray.raw = array;
		return stringsArray as TemplateStringsArray;
	};
}

container.db = new PrismaDatabase(prisma);

declare module '@sapphire/pieces' {
	interface Container {
		prisma: typeof prisma;
	}
}

interface GuildModerationMetadata {
	count: number;
	latest: number;
}
