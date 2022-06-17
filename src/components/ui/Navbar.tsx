import { useRouter } from 'next/router';
import useLocale from '../../hooks/useLocale';

export default function Navbar() {
    const [
        {
            home: { nav }
        },
        hl
    ] = useLocale();

    const router = useRouter();
    const hasLocale = hl && hl !== 'en_us';

    return (
        <header className='flex items-center justify-between border-b border-b-gray-200 shadow-sm md:border-none md:shadow-none'>
            <div className='flex items-center justify-center space-x-3 p-4 md:space-x-6'>
                <button
                    onClick={e => {
                        e.preventDefault();
                        return router.push(hasLocale ? `https://about.ruffpuff.dev/${hl}` : 'https://about.ruffpuff.dev', undefined, { shallow: true });
                    }}
                    className='rounded-md py-2 px-3 text-sm hover:underline'
                >
                    {nav.about}
                </button>
                <button
                    onClick={e => {
                        e.preventDefault();
                        return router.push(hasLocale ? `https://about.ruffpuff.dev/${hl}/projects` : 'https://about.ruffpuff.dev/projects', undefined, { shallow: true });
                    }}
                    className='rounded-md py-2 px-3 text-sm hover:underline'
                >
                    {nav.projects}
                </button>
            </div>
        </header>
    );
}
