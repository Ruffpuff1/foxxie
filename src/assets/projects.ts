interface Project {
    name: string;
    icon: string;
    homepage: string;
}

export const projects: Project[][] = [
    [
        {
            name: 'Cdn',
            icon: 'https://reese.cafe/images/icons/upload.png',
            homepage: '/cdn'
        },
        {
            name: 'Celestia',
            icon: 'https://reese.cafe/images/icons/star.png',
            homepage: '/celestia'
        },
        {
            name: 'Foxxie',
            icon: 'https://reese.cafe/images/icons/foxxie.png',
            homepage: '/foxxie'
        },
        {
            name: 'Developers',
            icon: 'https://reese.cafe/images/icons/developers.png',
            homepage: '/developers'
        }
    ],
    [
        {
            name: 'Home',
            icon: 'https://reese.cafe/images/icons/cup.png',
            homepage: '/'
        },
        {
            name: 'Kettu',
            icon: 'https://reese.cafe/images/icons/kettu.png',
            homepage: '/kettu'
        },
        {
            name: 'Newtab',
            icon: 'https://reese.cafe/images/icons/tabs.png',
            homepage: '/newtab'
        },
        {
            name: 'Todo',
            icon: 'https://reese.cafe/images/icons/todo.png',
            homepage: '/todo'
        }
    ]
];
