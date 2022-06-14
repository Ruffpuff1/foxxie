import useLocale from '../../hooks/useLocale';

export default function Navbar() {
    const [
        {
            home: { nav }
        },
        hl
    ] = useLocale();

    const hasLocale = hl && hl !== 'en_us';

    return (
        <header className='flex items-center justify-between border-b border-b-gray-200 shadow-sm duration-500 md:border-none md:shadow-none'>
            <div className='flex items-center justify-center space-x-3 p-4 duration-500 md:space-x-6 md:p-6'>
                <a
                    href={hasLocale ? `https://about.ruffpuff.dev/${hl}` : 'https://about.ruffpuff.dev'}
                    className='rounded-md py-2 px-3 text-sm duration-500 hover:bg-gray-100 hover:underline md:text-base'
                >
                    {nav.about}
                </a>
                <a
                    href={hasLocale ? `/${hl}/projects` : '/projects'}
                    className='rounded-md py-2 px-3 text-sm duration-500 hover:bg-gray-100 hover:underline md:text-base'
                >
                    {nav.projects}
                </a>
            </div>
        </header>
    );
}
