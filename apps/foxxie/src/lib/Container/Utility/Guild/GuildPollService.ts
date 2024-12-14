import { PollEntity } from '#lib/Database/entities/PollEntity';
import { Collection, Guild } from 'discord.js';

export class GuildPollService extends Collection<number, PollEntity> {
	public alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];

	public guild: Guild;

	public numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

	public constructor(guild: Guild) {
		super();
		this.guild = guild;
	}

	public create(data: Partial<PollEntity>): PollEntity {
		return new PollEntity(data).setup(this);
	}

	public entity(data: Partial<PollEntity>) {
		return new PollEntity(data);
	}

	public async fetch(id: number | string): Promise<null | PollEntity>;
	public async fetch(id: number[]): Promise<Collection<number, PollEntity>>;
	public async fetch(id?: null): Promise<this>;

	public async fetch(id?: null | number | number[] | string): Promise<Collection<number, PollEntity> | null | PollEntity | this> {
		if (!id) {
			const entries: PollEntity[] = [];
			return this._cache(entries.map((data) => new PollEntity(data).setup(this)));
		}

		if (typeof id === 'string') {
			const entry = null;

			if (!entry) return null;

			return this._cache(new PollEntity(entry).setup(this));
		}

		if (Array.isArray(id)) {
			const entries: PollEntity[] = [];
			return this._cache(entries);
		}

		if (super.has(id)) return super.get(id)!;

		const found = null;

		if (found) return this._cache(new PollEntity(found).setup(this));
		return null;
	}

	public insert(data: PollEntity | PollEntity[]): Collection<number, PollEntity> | null | PollEntity {
		return this._cache(data);
	}

	public mapOptions(options: string[], emojis: string[]) {
		return options.map((option, i) => {
			return {
				count: 0,
				emoji: emojis[i],
				name: option,
				optionNumber: i + 1
			};
		});
	}

	private _cache(entries: PollEntity | PollEntity[]): Collection<number, PollEntity> | null | PollEntity {
		if (!entries) return null;

		const parsedEntries = Array.isArray(entries) ? entries : [entries];

		for (const entry of parsedEntries) {
			super.set(entry.pollId, entry.setup(this));
		}

		return Array.isArray(entries) ? new Collection(entries.map((entry) => [entry.pollId, entry])) : entries;
	}
}
