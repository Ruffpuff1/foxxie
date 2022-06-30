import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar({ hide }: { hide: boolean; }) {
    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScoll = () => {
            if (window.scrollY === 0) {
                setScrolled(false);
            } else {
                setScrolled(true);
            }
        };

        window.addEventListener('scroll', handleScoll);

        return () => {
            window.removeEventListener('scroll', handleScoll);
        };
    }, [scrolled]);

    return (
        <header
            className={`foxxie-navbar fixed z-40 flex w-full items-center justify-between bg-white px-3 py-2 ${scrolled ? 'border-b border-b-gray-200 shadow-md' : ''} ${hide ? 'top-[-75px]' : 'top-0'
                }`}
        >
            <button onClick={() => router.push('/foxxie/about')} className='group flex items-center space-x-3 rounded-md p-2 duration-300 hover:bg-gray-100'>
                <Image aria-hidden='true' src='https://cdn.reese.cafe/icons/foxxie.png' width={30} height={30} alt="Foxxie's logo" />
                <h1 className='flex items-center space-x-2'>
                    <span className='text-xl font-[500] text-gray-600 group-hover:text-gray-900'>Foxxie</span>
                    <span className='text-xl text-gray-600'>Reese</span>
                </h1>
            </button>

            <button onClick={() => router.push('/community')} className='hidden xl:block rounded-md bg-blue-500 p-3 text-white'>
                Join the Server
            </button>
        </header>
    );
}
