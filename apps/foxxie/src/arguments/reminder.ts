import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import { LanguageKeys } from '#lib/i18n';
import { Schedules } from '#lib/util/constants';
import { fetchTasks, MappedTask } from '#lib/util/util';

export default class UserArgument extends Argument<MappedTask<Schedules.Reminder>> {
	public async run(parameter: string, { userId }: ArgumentContext): Promise<ArgumentResult<MappedTask<Schedules.Reminder>>> {
		const tasks = (await fetchTasks(Schedules.Reminder)).filter((job) => job.data.userId === userId);
		const task = tasks.find((task) => String(task.id) === parameter);

		if (!task)
			return this.error({
				context: { parameter },
				identifier: LanguageKeys.Arguments.Reminder,
				parameter
			});

		return this.ok(task);
	}
}
