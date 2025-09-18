import { UserDiscogs, UserDiscogsReleases, UserLastFM } from '@prisma/client';
import { seconds } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { isNullish, sleep } from '@sapphire/utilities';
import { DiscogsApi } from '#apis/last.fm/api/DiscogsApi';
import { PrismaDatabase } from '#lib/Setup/prisma';
import { months } from '#utils/common';
import { blue } from 'colorette';

export type DiscogsLastFMUser = { discogs: null | UserDiscogs; discogsReleases: UserDiscogsReleases[] } & UserLastFM;

export class DiscogsService {
	public static async GetOutdatedDiscogsUsers() {
		const updateCutoff = Date.now() - months(1);
		return container.prisma.userLastFM.findMany({
			include: {
				discogs: true,
				discogsReleases: true
			},
			take: 500,
			where: {
				discogs: {
					releasesLastUpdated: {
						lt: new Date(updateCutoff)
					}
				}
			}
		});
	}

	public static async GetUserCollection(userId: string) {
		return container.prisma.userDiscogsReleases.findMany({
			include: {
				release: {
					include: {
						formatDescriptions: true
					}
				}
			},
			where: {
				userId
			}
		});
	}

	public static async StoreUserReleases(user: DiscogsLastFMUser) {
		const pages = 50;
		const releases = await DiscogsApi.GetUserReleases(user.userid, pages);

		if (!releases?.releases || !releases.releases.length) {
			user.discogsReleases = [];

			return user.discogs;
		}

		const ids = releases.releases.map((s) => s.id);
		const existingReleases = await container.prisma.discogsRelease.findMany({
			where: {
				discogsId: {
					in: ids
				}
			}
		});

		await PrismaDatabase.sql(() => `DELETE FROM "UserDiscogsReleases" WHERE "userId" = '${user.userid}'`);
		const releasesToAdd: UserDiscogsReleases[] = [];

		for (const release of releases.releases) {
			const userDiscogsRelease = {
				dateAdded: new Date(Reflect.get(release, 'date_added')),
				instanceId: release.instance_id,
				quantity: release.basic_information.formats[0].qty,
				rating: release.rating === 0 ? null : release.rating,
				userId: user.userid
			} as UserDiscogsReleases;

			const existingRelease = existingReleases.find((w) => w.discogsId === release.id);
			if (isNullish(existingRelease)) {
				const newRelease = await container.prisma.discogsRelease.create({
					data: {
						artist: release.basic_information.artists[0].name,
						artistDiscogsId: release.basic_information.artists[0].id,
						coverUrl: release.basic_information.cover_image,
						discogsId: release.id,
						featuringArtist: release.basic_information.artists.length > 1 ? release.basic_information.artists[1].name : null,
						featuringArtistDiscogsId: release.basic_information.artists.length > 1 ? release.basic_information.artists[1].id : null,
						featuringArtistJoin: release.basic_information.artists[0].join,
						format: release.basic_information?.formats?.[0]?.name,
						formatDescriptions: {
							create: release.basic_information.formats[0]?.descriptions?.map((s) => ({ description: s }))
						},
						formatText: Reflect.get(release.basic_information?.formats?.[0], 'text'),
						genres: {
							create: release.basic_information.genres.map((s) => ({ description: s }))
						},
						label: release.basic_information.labels?.[0]?.name,
						masterId: release.basic_information.id === 0 ? null : release.basic_information.id,
						secondLabel: release.basic_information.labels.length > 1 ? release.basic_information.labels[1].name : null,
						styles: {
							create: release.basic_information.styles.map((s) => ({ description: s }))
						},
						title: release.basic_information.title,
						year: release.basic_information.year
					}
				});

				existingReleases.push(newRelease);
				userDiscogsRelease.releaseId = newRelease.discogsId;
			} else {
				userDiscogsRelease.releaseId = existingRelease.discogsId;
			}

			releasesToAdd.push(userDiscogsRelease);
		}

		await container.prisma.userDiscogsReleases.createMany({ data: releasesToAdd });

		return user.discogs;
	}

	public static async UpdateDiscogsUsers(usersToUpdate: DiscogsLastFMUser[]) {
		for (const user of usersToUpdate) {
			container.logger.debug(`[${blue('Discogs')}]: Automatically updating ${user.userid} | ${user.usernameLastFM}`);
			await DiscogsService.UpdateUserDiscogs(user);

			await sleep(seconds(5000));
		}
	}

	public static async UpdateUserDiscogs(user: DiscogsLastFMUser) {
		user.discogs = await DiscogsService.StoreUserReleases(user);
		// user.discogs = await this.updateCollectionValue(user.userid);
	}
}
