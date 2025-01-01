import { ApplyOptions } from '@sapphire/decorators';
import { readSettings } from '#lib/database';
import { PartialResponseValue, ResponseType, ScheduleEntry, Task } from '#lib/schedule';
import { floatPromise, seconds } from '#utils/common';
import { Schedules } from '#utils/constants';
import { fetchChannel } from '#utils/functions';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: Schedules.Disboard
}))
export class UserTask extends Task {
	public async run(data: ScheduleEntry.TaskData[Schedules.Disboard]): Promise<null | PartialResponseValue> {
		const guild = this.container.client.guilds.cache.get(data.guildId);
		if (!guild) return null;

		if (!guild.available) {
			return { type: ResponseType.Delay, value: seconds(20) };
		}

		const [message] = await readSettings(guild, ['disboardMessage', 'language']);

		const channel = await fetchChannel(guild, 'disboardChannel');
		if (!channel) return null;

		const base = 'bump the server';

		await floatPromise(channel.send({ allowedMentions: { parse: ['roles', 'users'] }, content: message || base }));
		return { type: ResponseType.Finished };
	}
}
