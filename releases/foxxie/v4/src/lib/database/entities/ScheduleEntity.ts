import type { ScheduleManager } from '../../structures/managers/ScheduleManager';
import { events } from '../../util';
import { container } from '@sapphire/framework';
import { Cron } from '@sapphire/time-utilities';
import { BaseEntity, Column, Entity, ObjectIdColumn, ValueTransformer } from 'typeorm';
import type { Task } from '..';

const cronTransformer: ValueTransformer = {
    from(value: string | null) {
        return value === null ? null : new Cron(value);
    },
    to(value: Cron | null) {
        return value === null ? null : value.cron;
    }
};

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

export type ResponseValue = PartialResponseValue & { entry: ScheduleEntity };

@Entity('schedule', { schema: 'public' })
export class ScheduleEntity extends BaseEntity {

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    #manager: ScheduleManager = null!;

    @ObjectIdColumn()
    public _id!: string;

    @Column('varchar')
    public id!: string;

    @Column('varchar')
    public taskId!: string;

    @Column('timestamp without time zone')
    public time!: Date;

    @Column('varchar', { nullable: true, transformer: cronTransformer, default: null })
    public recurring: Cron | null = null;

    @Column('boolean', { default: true })
    public catchUp = true;

    @Column('jsonb')
    public data!: Record<string, unknown>;

    #running = false;

    #paused = true;

    public setup(manager: ScheduleManager): ScheduleEntity {
        this.#manager = manager;
        return this;
    }

    public get task(): Task | null {
        return container.settings.tasks.get(this.taskId) ?? null;
    }

    public get running(): boolean {
        return this.#running;
    }

    public async run(): Promise<ResponseValue> {
        const { task } = this;
        if (!task?.enabled || this.#running || this.#paused) return { entry: this, type: ResponseType.Ignore };

        this.#running = true;
        let response: PartialResponseValue | null = null;
        try {
            response = (await task.run({ ...(this.data ?? {}), id: this.id })) as PartialResponseValue | null;
        } catch (error) {
            container.client.emit(events.TASK_ERROR, error, { piece: task, entity: this });
        }

        this.#running = false;

        if (response !== null) return { ...response, entry: this };

        return this.recurring
            ? { entry: this, type: ResponseType.Update, value: this.recurring.next() }
            : { entry: this, type: ResponseType.Finished };
    }

    public resume(): ScheduleEntity {
        this.#paused = false;
        return this;
    }

    public pause(): ScheduleEntity {
        this.#paused = true;
        return this;
    }

    public delete(): unknown {
        return this.#manager.remove(this);
    }

}