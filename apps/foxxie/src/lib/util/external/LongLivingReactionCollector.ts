import { container } from '@sapphire/pieces';
import { noop } from '@sapphire/utilities';
import { minutes } from '#utils/common';
import { Guild, GuildTextBasedChannelTypes, User } from 'discord.js';

export interface LLRCCollectOneOptions {
	filter?: (reaction: LLRCData) => boolean;
	time?: number;
}

export interface LLRCData {
	channel: GuildTextBasedChannelTypes;
	emoji: LLRCDataEmoji;
	guild: Guild;
	messageId: string;
	userId: string;
}

export interface LLRCDataEmoji {
	animated: boolean;
	id: null | string;
	managed: boolean | null;
	name: null | string;
	requireColons: boolean | null;
	roles: null | string[];
	user: { id: string } | User;
}

export type LongLivingReactionCollectorListener = (reaction: LLRCData) => void;

export class LongLivingReactionCollector {
	public endListener: (() => void) | null;

	public listener: LongLivingReactionCollectorListener | null;

	private _timer: NodeJS.Timeout | null = null;

	public constructor(listener: LongLivingReactionCollectorListener | null = null, endListener: (() => void) | null = null) {
		this.listener = listener;
		this.endListener = endListener;
		container.client.llrCollectors.add(this);
	}

	public end() {
		if (!container.client.llrCollectors.delete(this)) return this;

		if (this._timer) {
			clearTimeout(this._timer);
			this._timer = null;
		}
		if (this.endListener) {
			process.nextTick(this.endListener.bind(null));
			this.endListener = null;
		}
		return this;
	}

	public send(reaction: LLRCData): void {
		if (this.listener) this.listener(reaction);
	}

	public setEndListener(listener: () => void) {
		this.endListener = listener;
		return this;
	}

	public setListener(listener: LongLivingReactionCollectorListener | null) {
		this.listener = listener;
		return this;
	}

	public setTime(time: number) {
		if (this._timer) clearTimeout(this._timer);
		if (time === -1) this._timer = null;
		else this._timer = setTimeout(() => this.end(), time);
		return this;
	}

	public get ended(): boolean {
		return !container.client.llrCollectors.has(this);
	}

	public static collectOne({ filter = () => true, time = minutes(5) }: LLRCCollectOneOptions = {}) {
		return new Promise<LLRCData | null>((resolve) => {
			const llrc = new LongLivingReactionCollector(
				(reaction) => {
					if (filter(reaction)) {
						resolve(reaction);
						llrc.setEndListener(noop).end();
					}
				},
				() => {
					resolve(null);
				}
			).setTime(time);
		});
	}
}
