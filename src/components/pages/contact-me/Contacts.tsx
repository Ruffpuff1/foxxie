import { ReactNode } from 'react';

const ContactsData: Contact[][] = [
    [
        {
            header: 'Email',
            description: (
                <>
                    If you are looking to contact me, the best way is at{' '}
                    <a href='mailto:reese@reese.cafe' className='text-gray-500 underline hover:text-gray-400'>
                        reese@reese.cafe
                    </a>
                    .
                </>
            )
        },
        {
            header: 'Twitter',
            description: (
                <>
                    Wanting to tweet at me or just send something funny? Do it{' '}
                    <a href='https://twitter.com/Reeseharlak' className='text-gray-500 underline hover:text-gray-400'>
                        @Reeseharlak
                    </a>
                    .
                </>
            )
        }
    ],
    [
        {
            header: 'Github',
            description: (
                <>
                    See something that needs improving? Submit a pull request on{' '}
                    <a href='https://github.com/Ruffpuff1' className='text-gray-500 underline hover:text-gray-400'>
                        Github
                    </a>
                    .
                </>
            )
        },
        {
            header: 'Ko-fi',
            description: (
                <>
                    Like what I do? Consider supporting me on{' '}
                    <a href='https://ko-fi.com/Ruffpuff1' className='text-gray-500 underline hover:text-gray-400'>
                        Ko-fi
                    </a>
                    .
                </>
            )
        }
    ],
    [
        {
            header: 'Discord',
            description: (
                <>
                    Want to talk more? Join my community Discord server:{' '}
                    <a href='https://reese.cafe/community' className='text-gray-500 underline hover:text-gray-400'>
                        The Corner Store
                    </a>
                    .
                </>
            )
        }
    ]
];

export default function Contacts() {
    return (
        <div className='mb-36 w-full px-12 md:mt-28 md:px-44'>
            {ContactsData.map((cl, idx) => {
                return (
                    <ul key={idx} className='mt-16 grid grid-cols-1 space-y-16 lg:grid-cols-2 lg:space-y-0 lg:space-x-16'>
                        {cl.map(c => {
                            return (
                                <li id={c.header.toLowerCase()} key={c.header}>
                                    <h3 className='mb-3 text-2xl md:text-4xl'>{c.header}</h3>
                                    <p className='text-lg text-gray-600 sm:pr-36 md:text-2xl'>{c.description}</p>
                                </li>
                            );
                        })}
                    </ul>
                );
            })}
        </div>
    );
}

interface Contact {
    header: string;
    description: ReactNode;
}
