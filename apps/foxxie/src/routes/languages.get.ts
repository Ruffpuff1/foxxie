import { Route } from '@sapphire/plugin-api';

export class UserRoute extends Route {
	public run(_: Route.Request, reponse: Route.Response) {
		reponse.json([...this.container.i18n.languages.keys()]);
	}
}
