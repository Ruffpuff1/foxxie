import { Song } from '@assets/music/concerts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useConcertSong(songs: Song[], defaultId: string = songs[0].id, defaultSong: Song = songs[0]): [Song, (songId: string) => Promise<boolean>] {
    const [songHash, setSongHash] = useState(defaultId);
    const [song, setSong] = useState(defaultSong);
    const router = useRouter();

    useEffect(() => {
        setSong(songs.find(s => s.id === songHash)!);

        if (router.query.s && songs.map(s => s.id).includes(router.query.s as string)) {
            setSong(songs.find(s => s.id === router.query.s)!);
            setSongHash(router.query.s as string);
        }
    }, [songHash, songs, router.query.s]);

    const setSongTo = (id: string) => {
        setSongHash(id);
        return router.replace(`${router.asPath.split('?')[0]}?s=${id}`, undefined, { shallow: true });
    };

    return [song, setSongTo];
}
