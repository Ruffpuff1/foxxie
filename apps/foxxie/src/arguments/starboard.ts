import type { Message, Snowflake } from 'discord.js';

import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import { Starboard, StarboardData } from '#lib/database/Models/starboard';
import { LanguageKeys } from '#lib/i18n';

export class UserArgument extends Argument<Starboard> {
	public async run(parameter: string, context: ArgumentContext<Starboard>): Promise<ArgumentResult<Starboard>> {
		const guildStarboards = await this.container.prisma.starboard.findMany({
			orderBy: { id: 'desc' },
			where: { guildId: context.message.guildId! }
		});

		if (!parameter) {
			const latest = this.#fallbackToLatest(guildStarboards);
			if (latest) return this.ok(new Starboard(latest));

			return this.error({ context, identifier: LanguageKeys.Arguments.StarboardEmpty, parameter });
		}

		const resolveNumber = await this.number.run(parameter, { ...context, argument: this.number });
		if (resolveNumber.isOk()) {
			const resolvedNumberResult = this.#resolveNumberFromMessage(resolveNumber.unwrap(), guildStarboards);
			if (resolvedNumberResult) return this.ok(new Starboard(resolvedNumberResult));
		}

		const resolveSnowflake = await this.snowflake.run(parameter, { ...context, argument: this.snowflake });
		if (resolveSnowflake.isOk()) {
			const resolvedSnowflakeResult = this.#resolveStarboardFromSnowflake(resolveSnowflake.unwrap(), guildStarboards);
			if (resolvedSnowflakeResult) return this.ok(new Starboard(resolvedSnowflakeResult));
		}

		const latest = this.#fallbackToLatest(guildStarboards);
		if (latest) return this.ok(new Starboard(latest));

		return this.error({ context, identifier: LanguageKeys.Arguments.StarboardEmpty, parameter });
	}

	#fallbackToLatest(starboards: StarboardData[]) {
		return starboards[0] || null;
	}

	#resolveNumberFromMessage(id: number, starboards: StarboardData[]) {
		const found = starboards.find((star) => star.id === id);
		return found || null;
	}

	#resolveStarboardFromSnowflake(snowflake: Snowflake, starboards: StarboardData[]) {
		const found = starboards.find((star) => star.messageId === snowflake || star.starMessageId === snowflake);
		return found || null;
	}

	public get message() {
		return this.store.get('message') as Argument<Message<true>>;
	}

	public get number() {
		return this.store.get('number') as Argument<number>;
	}

	public get snowflake() {
		return this.store.get('snowflake') as Argument<Snowflake>;
	}
}
