/**
 * Copyright 2019-2021 Antonio Román
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { container } from '@sapphire/framework';
import { Cron } from '@sapphire/time-utilities';
import { ResponseType, ResponseValue, ScheduleEntity } from '../../database';

export class ScheduleManager {

    public queue: ScheduleEntity[] = [];
    public interval: NodeJS.Timer | null = null;

    public destroy(): void {
        this._clearInterval();
    }

    public async init(): Promise<void> {
        const { schedules } = container.db;
        const entries = await schedules.find();

        for (const entry of entries) this._insert(entry.setup(this).resume());
        this._checkInterval();
    }

    public async add(taskId: string, timeResolvable: TimeResolvable, options: ScheduleManagerAddOptions = {}): Promise<ScheduleEntity> {
        if (!container.settings.tasks.has(taskId)) throw new Error(`The task '${taskId}' does not exist.`);

        const [time, cron] = this._resolveTime(timeResolvable);
        const entry = new ScheduleEntity();
        entry.taskId = taskId;
        entry.id = this._generateID();
        entry.time = time;
        entry.recurring = cron;
        entry.catchUp = options.catchUp ?? true;
        entry.data = options.data ?? {};
        await entry.save();

        this._insert(entry.setup(this).resume());
        this._checkInterval();
        return entry;
    }

    _generateID(): string {
        return `${Date.now().toString(36)}${container.client.options.shardCount ? container.client.options.shardCount.toString(36) : (1).toString(36)}`;
    }

    public async remove(entityOrId: ScheduleEntity | string): Promise<boolean> {
        if (typeof entityOrId === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            entityOrId = this.queue.find(entity => entity.id === entityOrId)!;
            if (!entityOrId) return false;
        }

        await entityOrId.pause().remove();
        this._remove(entityOrId);
        this._checkInterval();
        return true;
    }

    public async execute(): Promise<void> {
        if (this.queue.length) {
            // Process the active tasks, they're sorted by the time they end
            const now = Date.now();
            const execute: Promise<ResponseValue>[] = [];
            for (const entry of this.queue) {
                if (entry.time.getTime() > now) break;
                execute.push(entry.run());
            }

            // Check if the Schedule has a task to run and run them if they exist
            if (!execute.length) return;
            await this._handleResponses(await Promise.all(execute));
        }

        this._checkInterval();
    }

    private _insert(entity: ScheduleEntity) {
        const index = this.queue.findIndex(entry => entry.time > entity.time);
        if (index === -1) this.queue.push(entity);
        else this.queue.splice(index, 0, entity);

        return entity;
    }

    private _remove(entity: ScheduleEntity) {
        const index = this.queue.findIndex(entry => entry === entity);
        if (index !== -1) this.queue.splice(index, 1);
    }

    private async _handleResponses(responses: readonly ResponseValue[]) {
        const { connection } = container.db;
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const updated: ScheduleEntity[] = [];
        const removed: ScheduleEntity[] = [];
        try {
            for (const response of responses) {
                // Pause so it is not re-run
                response.entry.pause();

                switch (response.type) {
                case ResponseType.Delay: {
                    response.entry.time = new Date(response.entry.time.getTime() + response.value);
                    updated.push(response.entry);
                    await queryRunner.manager.save(response.entry);
                    continue;
                }
                case ResponseType.Finished: {
                    removed.push(response.entry);
                    await queryRunner.manager.remove(response.entry);
                    continue;
                }
                case ResponseType.Ignore: {
                    continue;
                }
                case ResponseType.Update: {
                    response.entry.time = response.value;
                    updated.push(response.entry);
                    await queryRunner.manager.save(response.entry);
                }
                }
            }

            // Commit transaction
            await queryRunner.commitTransaction();

            // Update cache
            // - Remove expired entries
            for (const entry of removed) {
                this._remove(entry);
            }

            // - Update indexes
            for (const entry of updated) {
                const index = this.queue.findIndex(entity => entity === entry);
                if (index === -1) continue;

                this.queue.splice(index, 1);
                this._insert(entry);

                // Resume so it can be run again
                entry.resume();
            }
        } catch (error) {
            container.logger.fatal(error);

            // Rollback transaction
            await queryRunner.rollbackTransaction();

            // Reload all entities
            await Promise.all(updated.map(entry => entry.reload()));
        } finally {
            // Release transaction
            await queryRunner.release();
        }
    }

    private _clearInterval(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private _checkInterval(): void {
        if (!this.queue.length) {
            this._clearInterval();
        } else if (!this.interval) {
            this.interval = setInterval(this.execute.bind(this), 3000).unref();
        }
    }

    private _resolveTime(time: TimeResolvable): [Date, Cron | null] {
        if (time instanceof Date) return [time, null];
        if (time instanceof Cron) return [time.next(), time];
        if (typeof time === 'number') return [new Date(time), null];
        if (typeof time === 'string') {
            const cron = new Cron(time);
            return [cron.next(), cron];
        }
        throw new Error('invalid time passed');
    }

}

export type TimeResolvable = number | Date | string | Cron;

export interface ScheduleManagerAddOptions {

	catchUp?: boolean;

	data?: Record<string, unknown>;
}