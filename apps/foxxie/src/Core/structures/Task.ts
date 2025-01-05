import type { Awaitable } from '@sapphire/utilities';

import { container, Piece, PieceOptions } from '@sapphire/framework';
/**
 * @license Apache License 2.0
 * @copyright 2019 Skyra Project
 */

import { PartialResponseValue, ScheduleEntry } from './schedule/index.js';
import { decoratedTaskOptions, decoratedTaskRunMethods } from './TaskDecorators.js';

export abstract class Task<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> extends Piece<Task.Options> {
	public constructor(context: Piece.LoaderContext, options: Task.Options = {}) {
		const name = options.name ?? context.name;
		options = { ...options, ...(decoratedTaskOptions.get(name) || {}) };

		super(context, options);

		const foundRun = decoratedTaskRunMethods.get(this.name);
		if (foundRun) this.run = foundRun;
	}

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
