import { useRouter } from 'next/router';
import useLocale from '../../hooks/useLocale';

export default function Navbar() {
    const router = useRouter();
    const [
        {
            home: { nav }
        },
        hl
    ] = useLocale();

    const hasLocale = hl && hl !== 'en_us';

    return (
        <header className='flex items-center justify-between border-b border-b-gray-200 shadow-sm duration-500 md:border-none md:shadow-none'>
            <div className='px-4 py-3 md:px-6 md:py-3'>
                <h2 className='text-lg'>
                    <a href={hasLocale ? `/${hl}` : '/'} className='rounded-md px-2 py-1 text-blue-500 duration-500 hover:bg-gray-100 hover:underline'>
                        ./
                    </a>
                    Ruffpuff
                </h2>
            </div>
            <div className='flex items-center justify-center  space-x-5 p-4 duration-500 md:space-x-8 md:p-6'>
                <button
                    role='link'
                    onClick={() => router.push(hasLocale ? `https://about.ruffpuff.dev/${hl}` : 'https://about.ruffpuff.dev')}
                    className='rounded-md py-2 px-3 duration-500 hover:bg-gray-100 hover:underline'
                >
                    {nav.about}
                </button>
                <button
                    role='link'
                    onClick={() => router.push(hasLocale ? `/${hl}/projects` : '/projects')}
                    className='rounded-md py-2 px-3 duration-500 hover:bg-gray-100 hover:underline'
                >
                    {nav.projects}
                </button>
            </div>
        </header>
    );
}
