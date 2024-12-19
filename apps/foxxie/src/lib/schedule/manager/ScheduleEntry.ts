import { schedule } from '@prisma/client';
import { container } from '@sapphire/framework';
import { Cron } from '@sapphire/time-utilities';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { ModerationManager } from '#lib/moderation';
import { FoxxieEvents } from '#lib/types';
import { JSONEmbed } from '#root/commands/misc/reminder';
import { BirthdayData } from '#utils/birthday';
import { SchemaKeys, TypeVariation } from '#utils/moderationConstants';

export const enum ResponseType {
	Ignore,
	Delay,
	Update,
	Finished
}

export type PartialResponseValue =
	| { type: ResponseType.Delay; value: number }
	| { type: ResponseType.Finished | ResponseType.Ignore }
	| { type: ResponseType.Update; value: Date };

export type ResponseValue = { entry: ScheduleEntry } & PartialResponseValue;

export class ScheduleEntry<Type extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> {
	public catchUp!: boolean;
	public data!: ScheduleEntry.TaskData[Type];
	public id: number;
	public recurring!: Cron | null;
	public taskId: ScheduleEntry.TaskId;
	public time!: Date;

	#paused = false;

	#running = false;

	public constructor(data: schedule) {
		this.id = data.id;
		this.taskId = data.taskId as ScheduleEntry.TaskId;
		this.#patch(data);
	}

	public delete() {
		return container.schedule.remove(this);
	}

	public pause() {
		this.#paused = true;
		return this;
	}

	public async reload() {
		const entry = await container.prisma.schedule.findUnique({ where: { id: this.id } });
		if (entry === null) throw new Error('Failed to reload the entity');

		this.#patch(entry);
	}

	public reschedule(time: Date | number) {
		return container.schedule.reschedule(this, time);
	}

	public resume() {
		this.#paused = false;
		return this;
	}

	public async run(): Promise<ResponseValue> {
		const { task } = this;
		if (!task?.enabled || this.#running || this.#paused) return { entry: this, type: ResponseType.Ignore };

		this.#running = true;
		let response: null | PartialResponseValue = null;
		try {
			response = (await task.run({ ...(this.data ?? {}), id: this.id })) as null | PartialResponseValue;
		} catch (error) {
			container.client.emit(FoxxieEvents.TaskError, error, { entity: this, piece: task });
		}

		this.#running = false;

		if (response !== null) return { ...response, entry: this };

		return this.recurring
			? { entry: this, type: ResponseType.Update, value: this.recurring.next() }
			: { entry: this, type: ResponseType.Finished };
	}

	public async update(data: ScheduleEntry.UpdateData<Type>) {
		const entry = await container.prisma.schedule.update({
			data: data as any,
			where: { id: this.id }
		});

		this.#patch(entry);
	}

	#patch(data: Omit<schedule, 'id' | 'taskId'>) {
		this.time = data.time;
		this.recurring = isNullishOrEmpty(data.recurring) ? null : new Cron(data.recurring);
		this.catchUp = data.catchUp;
		this.data = data.data as ScheduleEntry.TaskData[Type];
	}

	public get running(): boolean {
		return this.#running;
	}

	public get task() {
		return container.stores.get('tasks').get(this.taskId) ?? null;
	}

	public static async create<const Type extends ScheduleEntry.TaskId>(data: ScheduleEntry.CreateData<Type>): Promise<ScheduleEntry<Type>> {
		const entry = await container.prisma.schedule.create({ data: data as any });
		return new ScheduleEntry(entry);
	}
}

export namespace ScheduleEntry {
	export interface BirthdayTaskData extends BirthdayData {
		guildId: string;
		userId: string;
	}

	export interface CreateData<Type extends TaskId> {
		catchUp: boolean;
		data: TaskData[Type];
		recurring: null | string;
		taskId: Type;
		time: Date | string;
	}

	export interface IndexUserQueueItem {
		indexQueue: boolean;
		userId: string;
	}

	export interface ReminderTaskData {
		channelId: null | string;
		createdChannelId: string;
		json: JSONEmbed | null;
		repeat: null | number;
		text: null | string;
		timeago: Date;
		userId: string;
	}

	export interface RemoveBirthdayRoleTaskData {
		guildId: string;
		roleId: string;
		userId: string;
	}

	export interface SharedModerationTaskData<Type extends TypeVariation> {
		[SchemaKeys.Case]: number;
		[SchemaKeys.Duration]: null | number;
		[SchemaKeys.ExtraData]: ModerationManager.ExtraData<Type>;
		[SchemaKeys.Guild]: string;
		[SchemaKeys.Refrence]: null | number;
		[SchemaKeys.Type]: number;
		[SchemaKeys.User]: string;
		scheduleRetryCount?: number;
	}

	export interface TaskData {
		birthday: BirthdayTaskData;
		indexUser: IndexUserQueueItem;
		moderationEndAddRole: SharedModerationTaskData<TypeVariation.RoleAdd>;
		moderationEndBan: SharedModerationTaskData<TypeVariation.Ban>;
		moderationEndMute: SharedModerationTaskData<TypeVariation.Mute>;
		moderationEndRemoveRole: SharedModerationTaskData<TypeVariation.RoleRemove>;
		moderationEndRestrictionAttachment: SharedModerationTaskData<TypeVariation.RestrictedAttachment>;
		moderationEndRestrictionEmbed: SharedModerationTaskData<TypeVariation.RestrictedEmbed>;
		moderationEndRestrictionEmoji: SharedModerationTaskData<TypeVariation.RestrictedEmoji>;
		moderationEndRestrictionReaction: SharedModerationTaskData<TypeVariation.RestrictedReaction>;
		moderationEndRestrictionVoice: SharedModerationTaskData<TypeVariation.RestrictedVoice>;
		moderationEndSetNickname: SharedModerationTaskData<TypeVariation.SetNickname>;
		moderationEndTimeout: SharedModerationTaskData<TypeVariation.Timeout>;
		moderationEndVoiceMute: SharedModerationTaskData<TypeVariation.VoiceMute>;
		moderationEndWarning: SharedModerationTaskData<TypeVariation.Warning>;
		poststats: null;
		reminder: ReminderTaskData;
		removeBirthdayRole: RemoveBirthdayRoleTaskData;
		syncResourceAnalytics: null;
	}

	export type TaskId = keyof TaskData;

	export interface UpdateData<Type extends TaskId> {
		catchUp?: boolean;
		data?: TaskData[Type];
		recurring?: null | string;
		time?: Date;
	}
}
