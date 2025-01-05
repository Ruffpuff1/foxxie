import { Schedules } from '#utils/constants';

import { Task } from './Task.js';

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

	public toJSON(): Task.Options {
		const options: Task.Options = {};

		if (this.name) Reflect.set(options, 'name', this.name);
		if (this.enabled !== undefined) Reflect.set(options, 'enabled', this.enabled);
		if (this.cron) Reflect.set(options, 'cron', this.cron);

		return options;
	}
}
