import type { Awaitable } from '@sapphire/utilities';

import { container, Piece, PieceOptions } from '@sapphire/framework';
/**
 * @license Apache License 2.0
 * @copyright 2019 Skyra Project
 */
import { PartialResponseValue, ScheduleEntry } from '#lib/schedule';
import { Schedules } from '#utils/constants';

export abstract class Task<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> extends Piece<Task.Options> {
	public override async onLoad(): Promise<unknown> {
		await container.schedule.ensureCron(this);
		return super.onLoad();
	}

	/**
	 * The run method to be overwritten in actual Task pieces
	 * @param data The data
	 */
	public abstract run(data: unknown): Awaitable<null | PartialResponseValue>;
}

export namespace Task {
	export type Options = { cron?: string } & PieceOptions;
}

export class TaskBuilder {
	private cron: string | undefined;

	private enabled!: boolean;

	private name!: Schedules;

	public setCron(cron: string | undefined) {
		this.cron = cron;
		return this;
	}

	public setEnabled(enabled: boolean) {
		this.enabled = enabled;
		return this;
	}

	public setName(name: Schedules) {
		this.name = name;
		return this;
	}

	public setProdOnly() {
		const enabled = container.client.enabledProdOnlyEvent();
		this.setEnabled(enabled);
		return this;
	}

	public toJSON(): Task.Options {
		const options: Task.Options = {};

		if (this.name) Reflect.set(options, 'name', this.name);
		if (this.enabled !== undefined) Reflect.set(options, 'enabled', this.enabled);
		if (this.cron) Reflect.set(options, 'cron', this.cron);

		return options;
	}
}
