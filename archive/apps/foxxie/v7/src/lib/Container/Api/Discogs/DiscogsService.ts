import { DiscogsGenre } from '#Api/Discogs/Structures/DiscogsGenre';
import { DiscogsRelease } from '#Api/Discogs/Structures/DiscogsRelease';
import { DiscogsStyle } from '#Api/Discogs/Structures/DiscogsStyle';
import { UserDiscogsRelease } from '#Api/LastFm/Structures/UserDiscogsRelease';
import { UserEntity } from '#lib/Database/entities/UserEntity';
import { EnvKeys } from '#lib/Types';
import { EnvParse } from '@foxxie/env';
import { DiscogsClient, DiscogsOAuth } from '@lionralfs/discogs-client/commonjs';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { sleep } from '@sapphire/utilities';
import { blue } from 'colorette';
import { User, bold, hyperlink } from 'discord.js';
import { DiscogsFormatDescriptions } from './Structures/DiscogsFormatDescriptions';

export class DiscogsService {
    public baseApiUrl = 'https://api.discogs.com';

    private consumerKey = EnvParse.string(EnvKeys.DiscogsConsumerKey);

    private oauthSignature = EnvParse.string(EnvKeys.DiscogsOAuthSignature);

    public async getDiscogsClientForUser(user: User): Promise<[DiscogsClient, UserEntity]> {
        const entity = await container.db.users.ensure(user.id);
        if (!entity.discogs.accessToken || !entity.discogs.accessTokenSecret) return this.discogsLogin(user);

        const client = this.getUserClient(entity.discogs.accessToken, entity.discogs.accessTokenSecret);
        const indentity = await client.getIdentity();

        entity.discogs.username = indentity.data.username;

        await entity.save();

        return [client, entity];
    }

    public async updateDiscogsUsers(usersToUpdate: UserEntity[]) {
        for (const user of usersToUpdate) {
            container.logger.debug(`[${blue('Discogs')}] Automatically updating ${user.id}`);
            await this.storeUserReleases(user);

            if (usersToUpdate.length > 1) await sleep(5000);
        }
    }

    public async getOutdatedDiscogsUsers() {
        // const updateCutoff = Date.now() - months(1);

        const users = await container.db.users.repository.find({
            where: {
                'discogs.username': {
                    $not: {
                        $eq: null
                    }
                }
            }
        });

        return users;
    }

    public async storeUserReleases(entity: UserEntity) {
        const discordUser = container.client.users.cache.get(entity.id);
        if (!discordUser) {
            entity.discogs.releases = [];
            return entity;
        }

        const [client] = await this.getDiscogsClientForUser(discordUser);

        const releases = await client.user().collection().getReleases(entity.discogs.username!, 0);
        if (!releases?.data?.releases || !releases.data?.releases.length) {
            entity.discogs.releases = [];
            return entity;
        }

        const ids = releases.data.releases.map(s => s.id);
        const existingReleases = entity.discogs.releases.filter(f => ids.includes(f.release?.discogsId));

        for (const release of releases.data.releases) {
            const userDiscogsRelease = new UserDiscogsRelease({
                instanceId: release.instance_id,
                quantity: release.basic_information.formats[0].qty,
                rating: release.rating === 0 ? null : release.rating,
                userId: entity.id
            });

            const existingRelease = existingReleases.find(d => d.release.discogsId === release.id);

            if (existingRelease && existingRelease.release) {
                userDiscogsRelease.releaseId = existingRelease.release.discogsId;
            } else {
                const newRelease = new DiscogsRelease({
                    discogsId: release.id,
                    masterId: release.basic_information.id === 0 ? null : release.basic_information.id,
                    coverUrl: release.basic_information.cover_image,
                    format: release.basic_information?.formats?.[0]?.name,
                    formatText: Reflect.get(release.basic_information?.formats?.[0], 'text'),
                    label: release.basic_information.labels?.[0]?.name,
                    secondLabel: release.basic_information.labels.length > 1 ? release.basic_information.labels[1].name : null,
                    year: release.basic_information.year,
                    formatDescription: release.basic_information.formats[0]?.descriptions?.map(
                        s => new DiscogsFormatDescriptions({ description: s })
                    ),
                    artist: release.basic_information.artists[0].name,
                    title: release.basic_information.title,
                    artistDiscogsId: release.basic_information.artists[0].id,
                    featuringArtistJoin: release.basic_information.artists[0].join,
                    featuringArtist:
                        release.basic_information.artists.length > 1 ? release.basic_information.artists[1].name : null,
                    featuredArtistDiscogsId:
                        release.basic_information.artists.length > 1 ? release.basic_information.artists[1].id : null,
                    genres: release.basic_information.genres.map(s => new DiscogsGenre({ description: s })),
                    styles: release.basic_information.styles.map(s => new DiscogsStyle({ description: s }))
                });

                userDiscogsRelease.release = newRelease;
                userDiscogsRelease.releaseId = newRelease.discogsId;

                entity.discogs.releases.push(userDiscogsRelease);
            }
        }

        return entity.save();
    }

    private async discogsLogin(user: User): Promise<[DiscogsClient, UserEntity]> {
        const { authorizeUrl, token, tokenSecret, oauthService } = await this.getAuthorized();

        let { dmChannel } = user;
        if (!dmChannel) {
            dmChannel = await resolveToNull(user.createDM());
            if (dmChannel === null) throw 'no dm';
        }

        await dmChannel.send(
            `To login to Discogs click the link ${hyperlink(bold('here'), authorizeUrl)} and paste the code back here.`
        );

        const messages = await dmChannel.awaitMessages({ max: 1 });
        const code = messages.first()?.content || null;

        if (!code) throw 'no code';

        const [accessToken, accessTokenSecret] = await this.getUserCredentials(token!, tokenSecret!, code, oauthService);

        const entity = await container.db.users.ensure(user.id);
        entity.discogs.accessToken = accessToken;
        entity.discogs.accessTokenSecret = accessTokenSecret;

        const client = this.getUserClient(accessToken!, accessTokenSecret!);

        const indentity = await client.getIdentity();

        entity.discogs.username = indentity.data.username;

        await entity.save();

        return [client, entity];
    }

    private async getAuthorized() {
        const oauthService = new DiscogsOAuth(this.consumerKey, this.oauthSignature);
        const result = await oauthService.getRequestToken('');
        return { oauthService, ...result };
    }

    private getAccessToken(token: string, secret: string, verifier: string, service: DiscogsOAuth) {
        return service.getAccessToken(token, secret, verifier);
    }

    private async getUserCredentials(token: string, secret: string, verifier: string, oauth?: DiscogsOAuth) {
        const { accessToken, accessTokenSecret } = await this.getAccessToken(
            token,
            secret,
            verifier,
            oauth || new DiscogsOAuth(this.consumerKey, this.oauthSignature)
        );

        return [accessToken, accessTokenSecret];
    }

    private getUserClient(accessToken: string, accessTokenSecret: string) {
        return new DiscogsClient({
            auth: {
                method: 'oauth',
                consumerKey: this.consumerKey,
                consumerSecret: this.oauthSignature,
                accessToken,
                accessTokenSecret
            }
        });
    }
}
