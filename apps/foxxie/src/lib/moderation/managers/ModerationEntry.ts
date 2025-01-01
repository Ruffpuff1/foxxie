import { container, UserError } from '@sapphire/framework';
import { isNullishOrZero } from '@sapphire/utilities';
import { ModerationData } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ScheduleEntry } from '#lib/schedule';
import { minutes } from '#utils/common';
import { TypeMetadata, TypeVariation } from '#utils/moderationConstants';
import { Guild, Snowflake, User } from 'discord.js';

export class ModerationEntry<Type extends TypeVariation = TypeVariation> {
	public channelId: null | string;

	public readonly createdAt: number;

	public duration!: null | number;

	public readonly extraData: ExtraDataTypes[Type];

	public readonly guild: Guild;

	public readonly id: number;

	public imageURL: null | string;

	public logChannelId: null | string;

	public logMessageId: null | string;

	public metadata: TypeMetadata;

	public readonly moderatorId: Snowflake;

	public reason: null | string;

	public refrenceId: null | number;

	public readonly type: Type;

	public readonly userId: Snowflake;

	#cacheExpiresTimeout = Date.now() + minutes(15);

	#moderator: null | User;

	#user: null | User;

	public constructor(data: ModerationEntry.Data<Type>) {
		this.id = data.id;
		this.createdAt = data.createdAt;
		this.extraData = data.extraData;
		this.guild = data.guild;
		this.reason = data.reason;
		this.imageURL = data.imageURL;
		this.type = data.type;
		this.metadata = data.metadata;
		this.refrenceId = data.refrenceId;
		this.channelId = data.channelId;
		this.logChannelId = data.logChannelId;
		this.logMessageId = data.logMessageId;

		this.#setDuration(data.duration);

		if (typeof data.moderator === 'string') {
			this.#moderator = null;
			this.moderatorId = data.moderator;
		} else {
			this.#moderator = data.moderator;
			this.moderatorId = data.moderator.id;
		}

		if (typeof data.user === 'string') {
			this.#user = null;
			this.userId = data.user;
		} else {
			this.#user = data.user;
			this.userId = data.user.id;
		}
	}

	/**
	 * Creates a new instance of `ModerationManagerEntry` with the same property values as the current instance.
	 */
	public clone() {
		return new ModerationEntry(this.toData());
	}

	/**
	 * Fetches the moderator who created the moderation entry.
	 */
	public async fetchModerator() {
		return (this.#moderator ??= await container.client.users.fetch(this.moderatorId));
	}

	/**
	 * Fetches the target user of the moderation entry.
	 */
	public async fetchUser() {
		return (this.#user ??= await container.client.users.fetch(this.userId));
	}

	/**
	 * Checks if the entry is archived.
	 */
	public isArchived() {
		return (this.metadata & TypeMetadata.Archived) === TypeMetadata.Archived;
	}

	/**
	 * Checks if the entry is completed.
	 */
	public isCompleted() {
		return (this.metadata & TypeMetadata.Completed) === TypeMetadata.Completed;
	}

	public isNotUserDependant() {
		return [TypeVariation.Lock, TypeVariation.Prune].includes(this.type);
	}

	/**
	 * Checks if the entry is temporary.
	 */
	public isTemporary() {
		return (this.metadata & TypeMetadata.Temporary) === TypeMetadata.Temporary;
	}

	/**
	 * Checks if the entry is an undo action.
	 */
	public isUndo() {
		return (this.metadata & TypeMetadata.Undo) === TypeMetadata.Undo;
	}

	/**
	 * Updates the moderation entry with the given data.
	 *
	 * @remarks
	 *
	 * This method does not update the database, it only updates the instance
	 * with the given data, and updates the cache expiration time.
	 *
	 * @param data - The data to update the entry.
	 */
	public patch(data: ModerationEntry.UpdateData) {
		if (data.duration !== undefined) this.#setDuration(data.duration);
		if (data.reason !== undefined) this.reason = data.reason;
		if (data.imageURL !== undefined) this.imageURL = data.imageURL;
		if (data.metadata !== undefined) this.metadata = data.metadata;
		if (data.refrenceId !== undefined) this.refrenceId = data.refrenceId;
		if (data.logChannelId !== undefined) this.logChannelId = data.logChannelId;
		if (data.logMessageId !== undefined) this.logMessageId = data.logMessageId;

		this.#cacheExpiresTimeout = Date.now() + minutes(15);
	}

	/**
	 * Returns a clone of the data for this moderation manager entry.
	 */
	public toData(): ModerationEntry.Data<Type> {
		return {
			channelId: this.channelId,
			createdAt: this.createdAt,
			duration: this.duration,
			extraData: this.extraData,
			guild: this.guild,
			id: this.id,
			imageURL: this.imageURL,
			logChannelId: this.logChannelId,
			logMessageId: this.logMessageId,
			metadata: this.metadata,
			moderator: this.moderatorId,
			reason: this.reason,
			refrenceId: this.refrenceId,
			type: this.type,
			user: this.userId
		};
	}

	public toJSON() {
		return {
			channelId: this.channelId,
			createdAt: this.createdAt,
			duration: this.duration,
			extraData: this.extraData,
			guildId: this.guild.id,
			id: this.id,
			imageURL: this.imageURL,
			logChannelId: this.logChannelId,
			logMessageId: this.logMessageId,
			metadata: this.metadata,
			moderatorId: this.moderatorId,
			reason: this.reason,
			refrenceId: this.refrenceId,
			type: this.type,
			userId: this.userId
		};
	}

	#isMatchingTask(task: ScheduleEntry) {
		return (
			task.data !== null &&
			(task.data as ScheduleEntry.SharedModerationTaskData<TypeVariation.Ban>).caseId === this.id &&
			(task.data as ScheduleEntry.SharedModerationTaskData<TypeVariation.Ban>).guildId === this.guild.id
		);
	}

	#setDuration(duration: bigint | null | number) {
		if (typeof duration === 'bigint') duration = Number(duration);
		if (isNullishOrZero(duration)) {
			this.duration = null;
			this.metadata &= ~TypeMetadata.Temporary;
		} else {
			this.duration = duration;
			this.metadata |= TypeMetadata.Temporary;
		}
	}

	/**
	 * Whether the moderation entry is cache expired, after 15 minutes.
	 *
	 * @remarks
	 *
	 * This property is used to determine if the entry should be removed from
	 * the cache, and will be updated to extend the cache life when
	 * {@linkcode patch} is called.
	 */
	public get cacheExpired() {
		return this.#cacheExpiresTimeout < Date.now();
	}

	/**
	 * Whether the moderation entry is expired.
	 *
	 * @remarks
	 *
	 * If {@linkcode expiresTimestamp} is `null`, this property will always be
	 * `false`.
	 */
	public get expired() {
		const { expiresTimestamp } = this;
		return expiresTimestamp !== null && expiresTimestamp < Date.now();
	}

	/**
	 * The timestamp when the moderation entry expires, if any.
	 *
	 * @remarks
	 *
	 * If {@linkcode duration} is `null` or `0`, this property will be `null`.
	 */
	public get expiresTimestamp() {
		return isNullishOrZero(this.duration) ? null : this.createdAt + this.duration;
	}

	/**
	 * The scheduled task for this moderation entry.
	 */
	public get task() {
		return container.schedule.queue.find((task) => this.#isMatchingTask(task)) ?? null;
	}

	public static from(guild: Guild, entity: ModerationData) {
		if (guild.id !== entity.guildId) {
			throw new UserError({ context: { parameter: entity.caseId }, identifier: LanguageKeys.Arguments.CaseNotInThisGuild });
		}

		return new this({
			channelId: entity.channelId,
			createdAt: entity.createdAt ? entity.createdAt.getTime() : Date.now(),
			duration: entity.duration,
			extraData: entity.extraData as any,
			guild,
			id: entity.caseId,
			imageURL: entity.imageUrl,
			logChannelId: entity.logChannelId,
			logMessageId: entity.logMessageId,
			metadata: entity.metadata,
			moderator: entity.moderatorId,
			reason: entity.reason,
			refrenceId: entity.refrenceId,
			type: entity.type,
			user: entity.userId!
		});
	}
}

export namespace ModerationEntry {
	export type CreateData<Type extends TypeVariation = TypeVariation> = MakeOptional<
		Omit<Data<Type>, 'createdAt' | 'guild' | 'id'>,
		'channelId' | 'duration' | 'extraData' | 'imageURL' | 'logChannelId' | 'logMessageId' | 'metadata' | 'moderator' | 'reason' | 'refrenceId'
	>;

	export interface Data<Type extends TypeVariation = TypeVariation> {
		channelId: null | string;
		createdAt: number;
		duration: bigint | null | number;
		extraData: ExtraData<Type>;
		guild: Guild;
		id: number;
		imageURL: null | string;
		logChannelId: null | string;
		logMessageId: null | string;
		metadata: TypeMetadata;
		moderator: Snowflake | User;
		reason: null | string;
		refrenceId: null | number;
		type: Type;
		user: Snowflake | User;
	}
	export type ExtraData<Type extends TypeVariation = TypeVariation> = ExtraDataTypes[Type];

	export type UpdateData<Type extends TypeVariation = TypeVariation> = Partial<
		Omit<Data<Type>, 'channelId' | 'extraData' | 'guild' | 'id' | 'moderator' | 'type' | 'user'>
	>;
}

interface ExtraDataTypes {
	[TypeVariation.Ban]: null;
	[TypeVariation.Dehoist]: { oldName: null | string };
	[TypeVariation.Kick]: null;
	[TypeVariation.Lock]: null;
	[TypeVariation.Mute]: Snowflake[];
	[TypeVariation.Prune]: { count: number };
	[TypeVariation.RaidBan]: { userCount: number };
	[TypeVariation.RestrictedAttachment]: null;
	[TypeVariation.RestrictedEmbed]: null;
	[TypeVariation.RestrictedEmoji]: null;
	[TypeVariation.RestrictedReaction]: null;
	[TypeVariation.RestrictedVoice]: null;
	[TypeVariation.RoleAdd]: { role: Snowflake };
	[TypeVariation.RoleRemove]: { role: Snowflake };
	[TypeVariation.SetNickname]: { oldName: null | string };
	[TypeVariation.Softban]: null;
	[TypeVariation.Timeout]: null;
	[TypeVariation.VoiceDeafen]: null;
	[TypeVariation.VoiceDisconnect]: null;
	[TypeVariation.VoiceMute]: null;
	[TypeVariation.Warning]: { id: number };
}

type MakeOptional<Type, OptionalKeys extends keyof Type> = Omit<Type, OptionalKeys> & Partial<Pick<Type, OptionalKeys>>;
