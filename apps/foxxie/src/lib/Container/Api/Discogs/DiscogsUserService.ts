import { DiscogsGenre } from '#Api/LastFm/Structures/DiscogsGenre';
import { DiscogsStyle } from '#Api/LastFm/Structures/DiscogsStyle';
import { UserDiscogsRelease } from '#Api/LastFm/Structures/UserDiscogsRelease';

export class DiscogsUserService {
    public accessToken: string | null = null;

    public accessTokenSecret: string | null = null;

    public releases: UserDiscogsRelease[] = [];

    public username: string | null = null;

    public constructor(data?: Partial<DiscogsUserService>) {
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
