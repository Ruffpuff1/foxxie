import { DiscogsClient } from '@lionralfs/discogs-client';
import { UserDiscogs } from '@prisma/client';
import { container } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { EnvKeys } from '#lib/types';
import { User } from 'discord.js';

export class DiscogsApi {
	public baseApiUrl = 'https://api.discogs.com';

	private consumerKey = envParseString(EnvKeys.DiscogsConsumerKey);

	private oauthSignature = envParseString(EnvKeys.DiscogsOAuthSignature);

	// public async discogsLogin(user: User): Promise<[DiscogsClient, UserEntity]> {
	// 	const { authorizeUrl, oauthService, token, tokenSecret } = await this.getAuthorized();

	// 	let { dmChannel } = user;
	// 	if (!dmChannel) {
	// 		dmChannel = await resolveToNull(user.createDM());
	// 		if (dmChannel === null) throw 'no dm';
	// 	}

	// 	await dmChannel.send(`To login to Discogs click the link ${hyperlink(bold('here'), authorizeUrl)} and paste the code back here.`);

	// 	const messages = await dmChannel.awaitMessages({ max: 1 });
	// 	const code = messages.first()?.content || null;

	// 	if (!code) throw 'no code';

	// 	const [accessToken, accessTokenSecret] = await this.getUserCredentials(token!, tokenSecret!, code, oauthService);

	// 	const entity = await container.db.users.ensure(user.id);
	// 	entity.discogs.accessToken = accessToken;
	// 	entity.discogs.accessTokenSecret = accessTokenSecret;

	// 	const client = this.getUserClient(accessToken!, accessTokenSecret!);

	// 	const indentity = await client.getIdentity();

	// 	entity.discogs.username = indentity.data.username;

	// 	await entity.save();

	// 	return [client, entity];
	// }

	public async getDiscogsClientForUser(user: User): Promise<[DiscogsClient, UserDiscogs]> {
		const discogs = await container.prisma.userDiscogs.findFirst({
			where: { userid: user.id }
		});

		if (!discogs?.accessToken || !discogs.accessTokenSecret) throw 'no discogs'; // return this.discogsLogin(user);

		const client = this.getUserClient(discogs.accessToken, discogs.accessTokenSecret);
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

	public async getUserReleases(userId: string, pages = 1) {
		const discordUser = container.client.users.cache.get(userId);
		if (!discordUser) {
			return null;
		}

		const [client, discogs] = await this.getDiscogsClientForUser(discordUser);

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
		// const ids = releases.data.releases.map((s) => s.id);
		// const existingReleases = entity.discogs.releases.filter((f) => ids.includes(f.release?.discogsId));

		// for (const release of releases.data.releases) {
		// 	const userDiscogsRelease = new UserDiscogsRelease({
		// 		instanceId: release.instance_id,
		// 		quantity: release.basic_information.formats[0].qty,
		// 		rating: release.rating === 0 ? null : release.rating,
		// 		userId: entity.id
		// 	});

		// 	const existingRelease = existingReleases.find((d) => d.release.discogsId === release.id);

		// 	if (existingRelease && existingRelease.release) {
		// 		userDiscogsRelease.releaseId = existingRelease.release.discogsId;
		// 	} else {
		// 		const newRelease = new DiscogsRelease({
		// 			artist: release.basic_information.artists[0].name,
		// 			artistDiscogsId: release.basic_information.artists[0].id,
		// 			coverUrl: release.basic_information.cover_image,
		// 			discogsId: release.id,
		// 			featuredArtistDiscogsId: release.basic_information.artists.length > 1 ? release.basic_information.artists[1].id : null,
		// 			featuringArtist: release.basic_information.artists.length > 1 ? release.basic_information.artists[1].name : null,
		// 			featuringArtistJoin: release.basic_information.artists[0].join,
		// 			format: release.basic_information?.formats?.[0]?.name,
		// 			formatDescription: release.basic_information.formats[0]?.descriptions?.map(
		// 				(s) => new DiscogsFormatDescriptions({ description: s })
		// 			),
		// 			formatText: Reflect.get(release.basic_information?.formats?.[0], 'text'),
		// 			genres: release.basic_information.genres.map((s) => new DiscogsGenre({ description: s })),
		// 			label: release.basic_information.labels?.[0]?.name,
		// 			masterId: release.basic_information.id === 0 ? null : release.basic_information.id,
		// 			secondLabel: release.basic_information.labels.length > 1 ? release.basic_information.labels[1].name : null,
		// 			styles: release.basic_information.styles.map((s) => new DiscogsStyle({ description: s })),
		// 			title: release.basic_information.title,
		// 			year: release.basic_information.year
		// 		});

		// 		console.log(newRelease);

		// 		userDiscogsRelease.release = newRelease;
		// 		userDiscogsRelease.releaseId = newRelease.discogsId;

		// 		entity.discogs.releases.push(userDiscogsRelease);
		// 	}
		// }

		// return entity.save();
	}

	// private getAccessToken(token: string, secret: string, verifier: string, service: DiscogsOAuth) {
	// 	return service.getAccessToken(token, secret, verifier);
	// }

	// private async getAuthorized() {
	// 	const oauthService = new DiscogsOAuth(this.consumerKey, this.oauthSignature);
	// 	const result = await oauthService.getRequestToken('');
	// 	return { oauthService, ...result };
	// }

	private getUserClient(accessToken: string, accessTokenSecret: string) {
		return new DiscogsClient({
			auth: {
				accessToken,
				accessTokenSecret,
				consumerKey: this.consumerKey,
				consumerSecret: this.oauthSignature,
				method: 'oauth'
			}
		});
	}

	// private async getUserCredentials(token: string, secret: string, verifier: string, oauth?: DiscogsOAuth) {
	// 	const { accessToken, accessTokenSecret } = await this.getAccessToken(
	// 		token,
	// 		secret,
	// 		verifier,
	// 		oauth || new DiscogsOAuth(this.consumerKey, this.oauthSignature)
	// 	);

	// 	return [accessToken, accessTokenSecret];
	// }
}
