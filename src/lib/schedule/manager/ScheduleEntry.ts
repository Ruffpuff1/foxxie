import { FoxxieEvents, ScheduleData } from '#lib/Types';
import { BirthdayData } from '#utils/birthday';
import { Schedules } from '#utils/constants';
import { schedule } from '@prisma/client';
import { cast } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { Cron } from '@sapphire/time-utilities';
import { isNullishOrEmpty } from '@sapphire/utilities';

export class ScheduleEntry<Type extends Schedules = Schedules> {
    public id: number;
    public taskId: Schedules;
    public time: Date;
    public recurring!: Cron | null;
    public catchUp!: boolean;
    public data!: ScheduleData<Type>;

    #running = false;

    #paused = false;

    public constructor(data: schedule) {
        this.id = data.id;
        this.taskId = data.taskId as Schedules;
        this.#patch(data);
    }

    public get task() {
        return container.stores.get('tasks').get(this.taskId) ?? null;
    }

    public get running(): boolean {
        return this.#running;
    }

    public resume() {
        this.#paused = false;
        return this;
    }

    public pause() {
        this.#paused = true;
        return this;
    }

    public reschedule(time: Date | number) {
        return container.schedule.reschedule(this, time);
    }

    public delete() {
        return container.schedule.remove(this);
    }

    public async run(): Promise<ResponseValue> {
        const { task } = this;
        if (!task?.enabled || this.#running || this.#paused) return { entry: this, type: ResponseType.Ignore };

        this.#running = true;
        let response: PartialResponseValue | null = null;
        try {
            response = (await task.run({ ...(this.data ?? {}), id: this.id })) as PartialResponseValue | null;
        } catch (error) {
            container.client.emit(FoxxieEvents.TaskError, error, { piece: task, entity: this });
        }

        this.#running = false;

        if (response !== null) return { ...response, entry: this };

        return this.recurring
            ? { entry: this, type: ResponseType.Update, value: this.recurring.next() }
            : { entry: this, type: ResponseType.Finished };
    }

    public async update(data: ScheduleEntry.UpdateData<Type>) {
        const entry = await container.prisma.schedule.update({
            where: { id: this.id },
            data
        });

        this.#patch(entry);
    }

    public async reload() {
        const entry = await container.prisma.schedule.findUnique({ where: { id: this.id } });
        if (entry === null) throw new Error('Failed to reload the entity');

        this.#patch(entry);
    }

    #patch(data: Omit<schedule, 'id' | 'taskId'>) {
        this.time = data.time;
        this.recurring = isNullishOrEmpty(data.recurring) ? null : new Cron(data.recurring);
        this.catchUp = data.catchUp;
        this.data = cast<ScheduleData<Type>>(data.data);
    }

    public static async create<const Type extends Schedules>(data: ScheduleEntry.CreateData<Type>): Promise<ScheduleEntry<Type>> {
        const entry = await container.prisma.schedule.create({ data });
        return new ScheduleEntry(entry);
    }
}

export const enum ResponseType {
    Ignore,
    Delay,
    Update,
    Finished
}

export type PartialResponseValue =
    | { type: ResponseType.Ignore | ResponseType.Finished }
    | { type: ResponseType.Delay; value: number }
    | { type: ResponseType.Update; value: Date };

export type ResponseValue = PartialResponseValue & { entry: ScheduleEntry };

export namespace ScheduleEntry {
    // interface SharedModerationTaskData<Type extends TypeVariation> {
    //     caseID: number;
    //     userID: string;
    //     guildID: string;
    //     type: Type;
    //     duration: number | null;
    //     extraData: ModerationManagerEntry.ExtraData<Type>;
    //     scheduleRetryCount?: number;
    // }

    export interface BirthdayTaskData extends BirthdayData {
        guildId: string;
        userId: string;
    }

    export interface CreateData<Type extends Schedules> {
        taskId: Type;
        time: Date | string;
        recurring: string | null;
        catchUp: boolean;
        data: ScheduleData<Type>;
    }

    export interface UpdateData<Type extends Schedules> {
        time?: Date;
        recurring?: string | null;
        catchUp?: boolean;
        data?: ScheduleData<Type>;
    }
}

export type ModerationScheduleEntry = ScheduleEntry<
    Schedules.EndTempBan | Schedules.EndTempMute | Schedules.EndTempNick | Schedules.EndTempRestrictEmbed
>;
