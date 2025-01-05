import { DiscogsClient } from '@lionralfs/discogs-client';
import { UserDiscogs } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import { User } from 'discord.js';

export class DiscogsApi {
	public static async GetDiscogsClientForUser(user: User): Promise<[DiscogsClient, UserDiscogs]> {
		const discogs = await container.prisma.userDiscogs.findFirst({
			where: { userid: user.id }
		});

		if (!discogs?.accessToken || !discogs.accessTokenSecret) throw 'no discogs'; // return this.discogsLogin(user);

		const client = DiscogsApi.GetUserClient(discogs.accessToken, discogs.accessTokenSecret);
		const identity = await client.getIdentity();

		if (identity.data.username !== discogs.username)
			await container.prisma.userDiscogs.update({
				data: {
					username: identity.data.username
				},
				where: {
					userid: user.id
				}
			});

		return [client, discogs];
	}

	public static async GetUserReleases(userId: string, pages = 1) {
		const discordUser = container.client.users.cache.get(userId);
		if (!discordUser) {
			return null;
		}

		const [client, discogs] = await DiscogsApi.GetDiscogsClientForUser(discordUser);

		const releases = await client.user().collection().getReleases(discogs.username!, 0, { per_page: 100, sort: 'added', sort_order: 'desc' });

		if (releases.data && releases.data.releases.length === 100 && pages > 1) {
			for (let i = 2; i <= pages; i++) {
				const pageResponse = await client.user().collection().getReleases(discogs.username!, 0, {
					page: i,
					per_page: 100,
					sort: 'added',
					sort_order: 'desc'
				});

				if (pageResponse.data?.releases && pageResponse.data.releases.length) {
					releases.data.releases.push(...pageResponse.data.releases);

					if (pageResponse.data.releases.length < 100) break;
				} else {
					break;
				}
			}
		}

		return releases.data;
	}

	private static GetUserClient(accessToken: string, accessTokenSecret: string) {
		return new DiscogsClient({
			auth: {
				accessToken,
				accessTokenSecret,
				consumerKey: DiscogsApi.ConsumerKey,
				consumerSecret: DiscogsApi.OauthSignature,
				method: 'oauth'
			}
		});
	}

	public static BaseApiUrl = 'https://api.discogs.com';

	private static ConsumerKey = envParseString(EnvKeys.DiscogsConsumerKey);

	private static OauthSignature = envParseString(EnvKeys.DiscogsOAuthSignature);
}
