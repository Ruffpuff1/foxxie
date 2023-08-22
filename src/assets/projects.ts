import { Icons } from './images';

interface Project {
    name: string;
    icon: string;
    homepage: string;
}

export const projects: Project[][] = [
    [
        {
            name: 'Cdn',
            icon: 'https://rsehrk.com/images/icons/upload.png',
            homepage: '/cdn'
        },
        {
            name: 'Celestia',
            icon: 'https://rsehrk.com/images/icons/star.png',
            homepage: '/celestia'
        },
        {
            name: 'Foxxie',
            icon: 'https://rsehrk.com/images/icons/foxxie.png',
            homepage: '/foxxie'
        },
        {
            name: 'Developers',
            icon: Icons.Developers,
            homepage: '/developers'
        }
    ],
    [
        {
            name: 'Home',
            icon: 'https://rsehrk.com/images/icons/cup.png',
            homepage: '/'
        },
        {
            name: 'Kettu',
            icon: 'https://rsehrk.com/images/icons/kettu.png',
            homepage: '/kettu'
        },
        {
            name: 'Music',
            icon: 'https://rsehrk.com/images/icons/violin.png',
            homepage: '/music'
        },
        {
            name: 'Newtab',
            icon: 'https://rsehrk.com/images/icons/tabs.png',
            homepage: 'https://newtab.rsehrk.com'
        }
    ],
    [
        {
            name: 'Rsehrk Links',
            icon: 'https://rsehrk.com/images/icons/link.png',
            homepage: '/rsehrk'
        },
        {
            name: 'Todo',
            icon: 'https://rsehrk.com/images/icons/todo.png',
            homepage: '/todo'
        }
    ]
];

export const latestWorks: Project[] = [
    {
        name: 'Introducing rsehrk.com, a shortened link service for quickly accessing my websites',
        icon: 'https://rsehrk.com/images/icons/link.png',
        homepage: '/rsehrk'
    },
    {
        name: 'Working on the Kiko Discord bot, a public bot for customizing your server',
        icon: 'https://rsehrk.com/images/assets/kiko/kiko_chibi.png',
        homepage: 'https://kiko.gg'
    }
];
