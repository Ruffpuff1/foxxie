const links: Link[] = [
    {
        text: 'Support',
        link: 'https://ruffpuff.dev/community'
    },
    {
        text: 'Github',
        link: 'https://github.com/FoxxieBot'
    },
    {
        text: 'Ko-fi',
        link: 'https://ko-fi.com/ruffpuff'
    }
];

interface Link {
    text: string;
    link: string
}

export function Footer() {
    return (
        <div className='bg-gray w-full mt-28 text-light-white text-xs space-y-1 transition-all duration-300 bottom-0 h-14 absolute overflow-hidden'>
            <div className="pt-2 space-y-1">
                <div className='flex justify-center space-x-5'>
                    {
                        links.map(link => {
                            return (
                                <a
                                    key={link.text}
                                    href={link.link}
                                    target='_blank'
                                    rel="noreferrer"
                                    className='hover:underline'
                                >
                                    {link.text}
                                </a>
                            );
                        })
                    }
                </div>
                <div className='flex justify-center space-x-4'>
                    <a
                        href='mailto:contact@ruffpuff.dev'
                        target='_blank'
                        rel="noreferrer"
                        className='hover:underline'
                    >
                        contact@ruffpuff.dev
                    </a>
                    <a
                        href='https://github.com/FoxxieBot/foxxie/blob/main/LICENSE'
                        target='_blank'
                        rel="noreferrer"
                        className='hover:underline'
                    >
                        Copyright © Foxxie 2021
                    </a>
                </div>
            </div>
        </div>
    );
}
