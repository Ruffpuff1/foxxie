import { ModerationData } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { ScheduleEntry } from '#lib/schedule';
import { minutes } from '#utils/common';
import { TypeMetadata, TypeVariation } from '#utils/moderation';
import { container, UserError } from '@sapphire/framework';
import { isNullishOrZero } from '@sapphire/utilities';
import { Guild, Snowflake, User } from 'discord.js';

export class ModerationEntry<Type extends TypeVariation = TypeVariation> {
	public readonly id: number;

	public readonly createdAt: number;

	public duration!: number | null;

	public readonly extraData: ExtraDataTypes[Type];

	public readonly guild: Guild;

	public readonly moderatorId: Snowflake;

	public readonly userId: Snowflake;

	public reason: string | null;

	public imageURL: string | null;

	public refrenceId: number | null;

	public channelId: string | null;

	public logChannelId: string | null;

	public logMessageId: string | null;

	public readonly type: Type;

	public metadata: TypeMetadata;

	#moderator: User | null;

	#user: User | null;

	#cacheExpiresTimeout = Date.now() + minutes(15);

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

		this.#cacheExpiresTimeout = Date.now() + minutes(15);
	}

	/**
	 * The scheduled task for this moderation entry.
	 */
	public get task() {
		return container.schedule.queue.find((task) => this.#isMatchingTask(task)) ?? null;
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

	public isNotUserDependant() {
		return [TypeVariation.Prune, TypeVariation.Lock].includes(this.type);
	}

	/**
	 * Checks if the entry is an undo action.
	 */
	public isUndo() {
		return (this.metadata & TypeMetadata.Undo) === TypeMetadata.Undo;
	}

	/**
	 * Checks if the entry is temporary.
	 */
	public isTemporary() {
		return (this.metadata & TypeMetadata.Temporary) === TypeMetadata.Temporary;
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
	 * Returns a clone of the data for this moderation manager entry.
	 */
	public toData(): ModerationEntry.Data<Type> {
		return {
			id: this.id,
			createdAt: this.createdAt,
			duration: this.duration,
			extraData: this.extraData,
			guild: this.guild,
			moderator: this.moderatorId,
			user: this.userId,
			reason: this.reason,
			imageURL: this.imageURL,
			refrenceId: this.refrenceId,
			channelId: this.channelId,
			logChannelId: this.logChannelId,
			logMessageId: this.logMessageId,
			type: this.type,
			metadata: this.metadata
		};
	}

	public toJSON() {
		return {
			id: this.id,
			createdAt: this.createdAt,
			duration: this.duration,
			extraData: this.extraData,
			guildId: this.guild.id,
			moderatorId: this.moderatorId,
			userId: this.userId,
			reason: this.reason,
			imageURL: this.imageURL,
			refrenceId: this.refrenceId,
			channelId: this.channelId,
			logChannelId: this.logChannelId,
			logMessageId: this.logMessageId,
			type: this.type,
			metadata: this.metadata
		};
	}

	#isMatchingTask(task: ScheduleEntry) {
		return (
			task.data !== null &&
			(task.data as ScheduleEntry.SharedModerationTaskData<TypeVariation.Ban>).caseId === this.id &&
			(task.data as ScheduleEntry.SharedModerationTaskData<TypeVariation.Ban>).guildId === this.guild.id
		);
	}

	#setDuration(duration: bigint | number | null) {
		if (typeof duration === 'bigint') duration = Number(duration);
		if (isNullishOrZero(duration)) {
			this.duration = null;
			this.metadata &= ~TypeMetadata.Temporary;
		} else {
			this.duration = duration;
			this.metadata |= TypeMetadata.Temporary;
		}
	}

	public static from(guild: Guild, entity: ModerationData) {
		if (guild.id !== entity.guildId) {
			throw new UserError({ identifier: LanguageKeys.Arguments.CaseNotInThisGuild, context: { parameter: entity.caseId } });
		}

		return new this({
			id: entity.caseId,
			createdAt: entity.createdAt ? entity.createdAt.getTime() : Date.now(),
			duration: entity.duration,
			extraData: entity.extraData as any,
			guild,
			moderator: entity.moderatorId,
			user: entity.userId!,
			reason: entity.reason,
			imageURL: entity.imageUrl,
			refrenceId: entity.refrenceId,
			channelId: entity.channelId,
			logChannelId: entity.logChannelId,
			logMessageId: entity.logMessageId,
			type: entity.type,
			metadata: entity.metadata
		});
	}
}

export namespace ModerationEntry {
	export interface Data<Type extends TypeVariation = TypeVariation> {
		id: number;
		createdAt: number;
		duration: bigint | number | null;
		extraData: ExtraData<Type>;
		guild: Guild;
		moderator: User | Snowflake;
		user: User | Snowflake;
		reason: string | null;
		imageURL: string | null;
		refrenceId: number | null;
		channelId: string | null;
		logChannelId: string | null;
		logMessageId: string | null;
		type: Type;
		metadata: TypeMetadata;
	}

	export type CreateData<Type extends TypeVariation = TypeVariation> = MakeOptional<
		Omit<Data<Type>, 'id' | 'guild' | 'createdAt'>,
		'duration' | 'imageURL' | 'extraData' | 'metadata' | 'moderator' | 'reason' | 'refrenceId' | 'channelId' | 'logChannelId' | 'logMessageId'
	>;
	export type UpdateData<Type extends TypeVariation = TypeVariation> = Partial<
		Omit<Data<Type>, 'id' | 'extraData' | 'moderator' | 'user' | 'type' | 'guild' | 'channelId'>
	>;

	export type ExtraData<Type extends TypeVariation = TypeVariation> = ExtraDataTypes[Type];
}

type MakeOptional<Type, OptionalKeys extends keyof Type> = Omit<Type, OptionalKeys> & Partial<Pick<Type, OptionalKeys>>;

interface ExtraDataTypes {
	[TypeVariation.Ban]: null;
	[TypeVariation.Kick]: null;
	[TypeVariation.Mute]: Snowflake[];
	[TypeVariation.Prune]: { count: number };
	[TypeVariation.Softban]: null;
	[TypeVariation.Warning]: { id: number };
	[TypeVariation.Lock]: null;
	[TypeVariation.VoiceMute]: null;
	[TypeVariation.VoiceDeafen]: null;
	[TypeVariation.VoiceDisconnect]: null;
	[TypeVariation.SetNickname]: { oldName: string | null };
	[TypeVariation.RestrictedReaction]: null;
	[TypeVariation.RestrictedEmbed]: null;
	[TypeVariation.RestrictedAttachment]: null;
	[TypeVariation.RestrictedVoice]: null;
	[TypeVariation.RoleAdd]: { role: Snowflake };
	[TypeVariation.RoleRemove]: { role: Snowflake };
	[TypeVariation.RestrictedEmoji]: null;
	[TypeVariation.Timeout]: null;
	[TypeVariation.Dehoist]: { oldName: string | null };
	[TypeVariation.RaidBan]: { userCount: number };
}
