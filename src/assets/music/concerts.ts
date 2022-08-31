import { addSolo, byName, emhsFestival2022Performers, merge, Performer } from './performers';

export const emhsFestival2022Orchestra: Concert[] = [
    {
        songs: [
            {
                embedId: 'NmoKRrNmJLM',
                id: 'land-of-dragons',
                title: 'Land of Dragons',
                composer: 'Chris Thomas',
                performers: emhsFestival2022Performers
            },
            {
                embedId: 'Rb6jf15tVSM',
                id: 'fantasia-on-an-original-theme',
                title: 'Fantasia on an Original Theme',
                composer: 'Joseph J. Philips',
                performers: emhsFestival2022Performers
            },
            {
                embedId: 'l-w2TDe2VkE',
                id: 'mythos',
                title: 'Mythos',
                composer: 'Soon Hee Newbold',
                performers: emhsFestival2022Performers
            },
            {
                embedId: 'GVFw2pj9Rdg',
                id: 'themes-from-the-new-world-symphony',
                title: 'Themes from the New World Symphony',
                composer: 'Nicholai Rimsky-Korsakov arr. Carrie Lane Gruselle',
                performers: emhsFestival2022Performers
            }
        ],
        school: {
            director: 'Brian Glahn',
            name: 'El Modena High School',
            href: 'emhs'
        },
        playlistUrl: 'rsehrk.com/EmhsOrchestraFestival2022Playlist',
        name: 'Festival 2022 Concert',
        path: 'concert/2022/festival'
    },
    {
        songs: [
            {
                embedId: 'cMavhc8TsXo',
                id: 'the-magical-world-of-pixar',
                title: 'The Magical World of Pixar',
                composer: 'Robert Longfield',
                performers: merge(addSolo(byName('Tyler Chapa', emhsFestival2022Performers)), emhsFestival2022Performers, (p, f) => p.name !== f.name)
            },
            {
                embedId: 'lYKKuaRRaTA',
                id: 'disney-classics',
                title: 'Disney Classics',
                composer: 'Charles Sayre',
                performers: emhsFestival2022Performers
            },
            {
                embedId: 'PV6b1pbf3mU',
                id: 'the-little-mermaid',
                title: 'The Little Mermaid',
                composer: 'Larry Moore',
                performers: emhsFestival2022Performers
            },
            {
                embedId: '4NEpY19EzVM',
                id: 'aladdin',
                title: 'Aladdin',
                composer: 'John Moss with music by Alan Menken',
                performers: emhsFestival2022Performers
            },
            {
                embedId: 'LwbrsWnl3R0',
                id: 'the-magic-of-harry-potter',
                title: 'The Magic of Harry Potter',
                composer: 'Michael Story with music by John Williams, Patrick Doyle, Nicholas Hooper, and Alexandre Desplat',
                performers: merge(addSolo(byName('Violet Groendyke', emhsFestival2022Performers)), emhsFestival2022Performers, (p, f) => p.name !== f.name)
            }
        ],
        school: {
            director: 'Brian Glahn',
            name: 'El Modena High School',
            href: 'emhs'
        },
        playlistUrl: 'rsehrk.com/EmhsOrchestraSpring2022Playlist',
        name: 'Spring 2022 Concert',
        path: 'concert/2022/spring'
    }
];

export const emhsConcerts: Concert[] = [...emhsFestival2022Orchestra];

export interface Concert {
    songs: Song[];
    school: School;
    playlistUrl?: string;
    name: string;
    path: string;
}

export interface Song {
    embedId: string;
    id: string;
    title: string;
    composer: string;
    performers: Performer[];
}

export interface School {
    director: string;
    name: string;
    href: string;
}
