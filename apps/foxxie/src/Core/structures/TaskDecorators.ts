import { createMethodDecorator } from '@sapphire/decorators';
import { container } from '@sapphire/pieces';
import { Schedules } from '#utils/constants';

import { PartialResponseValue, ResponseType } from './schedule/ScheduleEntry.js';
import { Task as FoxxieTask } from './Task.js';
import { TaskBuilder } from './TaskBuilder.js';

export const decoratedTaskOptions = new Map<string, FoxxieTask.Options>();
export const decoratedTaskRunMethods = new Map<string, FoxxieTask['run']>();

export const Task = (options?: ((builder: TaskBuilder) => TaskBuilder) | FoxxieTask.Options | Schedules) => {
	const resolvedOptions =
		typeof options === 'function' ? options(new TaskBuilder()).toJSON() : typeof options === 'string' ? { name: options } : options || {};

	return createMethodDecorator((_, prop, descriptor) => {
		const parsedOptions = {
			name: String(resolvedOptions.name || prop).toLowerCase(),
			...Object.fromEntries(Object.entries(resolvedOptions).filter(([, value]) => value !== undefined))
		} as FoxxieTask.Options;

		decoratedTaskOptions.set(parsedOptions.name!, parsedOptions);
		decoratedTaskRunMethods.set(parsedOptions.name!, descriptor.value as FoxxieTask['run']);

		void container.stores
			.loadPiece({
				name: parsedOptions.name!,
				piece: FoxxieTask as any,
				store: 'tasks'
			})
			.catch(console.log);

		const run = descriptor.value;

		if (!run) throw 'no method';
		if (typeof run !== 'function') throw 'not a method';

		descriptor.value = async function value(this: any, ...args: any[]) {
			return run!.call(this, ...args);
		} as unknown as undefined;
	});
};

export const ProductionOnlyTask = (on: boolean = true) => {
	return createMethodDecorator((_, __, descriptor) => {
		const run = descriptor.value;

		if (!run) throw 'no method';
		if (typeof run !== 'function') throw 'not a method';

		descriptor.value = async function value(this: any, ...args: any[]) {
			const enabled = container.client.enabledProdOnlyEvent();

			if (!enabled && on) return { type: ResponseType.Ignore } as PartialResponseValue;
			return run!.call(this, ...args);
		} as unknown as undefined;
	});
};
