import { DiscogsGenre } from '#Api/Discogs/Structures/DiscogsGenre';
import { DiscogsStyle } from '#Api/Discogs/Structures/DiscogsStyle';
import { UserDiscogsRelease } from '#Api/LastFm/Structures/UserDiscogsRelease';

export class DiscogsUser {
    public accessToken: string | null = null;

    public accessTokenSecret: string | null = null;

    public releases: UserDiscogsRelease[] = [];

    public username: string | null = null;

    public constructor(data?: Partial<DiscogsUser>) {
        Object.assign(this, data);

        this.entityLoad();
    }

    private entityLoad(): void {
        this.releases = this.releases.map(
            r =>
                new UserDiscogsRelease({
                    ...r,
                    release: {
                        ...r.release,
                        genres: r.release.genres.map(g => new DiscogsGenre(g)),
                        styles: r.release.styles.map(s => new DiscogsStyle(s))
                    }
                })
        );
    }

    public get isLoggedIn(): boolean {
        return Boolean(this.accessToken && this.accessTokenSecret);
    }
}
