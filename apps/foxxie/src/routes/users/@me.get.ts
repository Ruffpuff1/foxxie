import { resolveToNull } from '@ruffpuff/utilities';
import { HttpCodes, Route } from '@sapphire/plugin-api';
import { FlattenedGuild, flattenGuild, flattenUser } from '#lib/api/Foxxie/index';

export class UserRoute extends Route {
	public async run(request: Route.Request, response: Route.Response) {
		const { client } = this.container;
		const { id } = request.query;

		if (typeof id !== 'string') return response.error(HttpCodes.BadRequest);
		const user = await resolveToNull(client.users.fetch(id));
		if (user === null) return response.error(HttpCodes.InternalServerError);

		const guilds: FlattenedGuild[] = [];
		for (const guild of client.guilds.cache.values()) {
			if (guild.members.cache.has(user.id)) guilds.push(flattenGuild(guild));
		}
		return response.json({ ...flattenUser(user), guilds });
	}
}
