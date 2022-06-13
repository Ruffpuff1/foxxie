import { useRouter } from "next/router";
import useLocale from "../../hooks/useLocale";

export default function Navbar() {
    const router = useRouter();
    const [{ home: { nav } }, hl] = useLocale();

    const hasLocale = hl && hl !== 'en_us';

    return (
        <header className="flex border-b border-b-gray-200 md:border-none shadow-sm md:shadow-none duration-500 items-center p-4 md:p-6 justify-between">
            <div>
                <h2 className='text-lg'>
                    Ruffpuff
                    <a href={hasLocale ? `/${hl}` : '/'} className='text-blue-500 hover:bg-gray-100 rounded-md duration-500 px-2 py-1 hover:underline'>Dev</a>
                </h2>
            </div>
            <div className='flex items-center duration-500 justify-center space-x-5 md:space-x-8'>
                <button role='link' onClick={() => router.push(hasLocale ? `/${hl}/about` : '/about')} className='p-1 hover:text-blue-500 duration-500 hover:underline'>
                    {nav.about}
                </button>
                <button role='link' onClick={() => router.push(hasLocale ? `/${hl}/projects` : '/projects')} className='p-1 hover:text-blue-500 duration-500 hover:underline'>
                    {nav.projects}
                </button>
            </div>
        </header>
    );
}
