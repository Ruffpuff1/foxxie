import { Starboard, StarboardData } from '#lib/Database/Models/starboard';
import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import type { Message, Snowflake } from 'discord.js';

export class UserArgument extends Argument<Starboard> {
	public async run(parameter: string, context: ArgumentContext<Starboard>): Promise<ArgumentResult<Starboard>> {
		const guildStarboards = await this.container.prisma.starboard.findMany({
			where: { guildId: context.message.guildId! },
			orderBy: { id: 'desc' }
		});

		if (!parameter) {
			const latest = this.#fallbackToLatest(guildStarboards);
			if (latest) return this.ok(new Starboard(latest));

			return this.error({ parameter, identifier: 'arguments:starboardEmpty', context });
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

		return this.error({ parameter, identifier: 'arguments:starboardEmpty', context });
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

	public get number() {
		return this.store.get('number') as Argument<number>;
	}

	public get message() {
		return this.store.get('message') as Argument<Message<true>>;
	}

	public get snowflake() {
		return this.store.get('snowflake') as Argument<Snowflake>;
	}
}
