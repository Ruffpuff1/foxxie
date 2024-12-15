/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useScroll } from '@reeseharlak/usehooks';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdLibraryBooks, MdPolicy, MdQuestionAnswer, MdSearch, MdSettingsSuggest } from 'react-icons/md';

export default function Navbar({ hide }: { hide: boolean; }) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [showItems, setShowItems] = useState(false);

    useScroll(() => {
        if (window.scrollY === 0) {
            setScrolled(false);
        } else {
            setScrolled(true);
        }
    }, [scrolled]);

    return (
        <>
            <div id='top' />

            <header className={`foxxie-navbar fixed z-40 w-full bg-white ${scrolled ? 'border-b border-b-gray-200 shadow-md' : ''} ${hide ? 'top-[-75px]' : 'top-0'}`}>
                <div className='flex items-center justify-between px-3 py-2'>
                    <button onClick={() => router.push('/foxxie/about')} className='group flex items-center space-x-3 rounded-md p-2 duration-300 hover:bg-gray-100'>
                        <Image aria-hidden='true' src='https://rsehrk.com/images/icons/foxxie.png' width={30} height={30} alt="Foxxie's logo" />
                        <h1 className='flex items-center space-x-2'>
                            <span className='text-xl font-medium text-gray-600 group-hover:text-gray-900'>Foxxie</span>
                        </h1>
                    </button>

                    <div
                        onMouseEnter={() => {
                            setShowItems(true);
                        }}
                        onMouseLeave={() => {
                            setShowItems(false);
                        }}
                        className='flex items-center space-x-3'
                    >
                        <ul
                            className={`hidden items-center space-x-10 overflow-x-hidden whitespace-nowrap text-xs text-gray-600 duration-300 sm:flex md:text-sm ${showItems ? 'w-[500px] opacity-100' : 'w-0 opacity-0'
                                }`}
                        >
                            <li>
                                <a href='/foxxie/commands' className='flex items-center space-x-2 font-[550] duration-200 hover:text-gray-500 hover:underline'>
                                    <MdSettingsSuggest />
                                    <span>Commands</span>
                                </a>
                            </li>

                            <li>
                                <a href='/foxxie/terms' className='flex items-center space-x-2 font-[550] duration-200 hover:text-gray-500 hover:underline'>
                                    <MdSearch />
                                    <span>Terms of Service</span>
                                </a>
                            </li>

                            <li>
                                <a href='/foxxie/faq' className='flex items-center space-x-2 font-[550] duration-200 hover:text-gray-500 hover:underline'>
                                    <MdQuestionAnswer />
                                    <span>FAQ</span>
                                </a>
                            </li>

                            <li>
                                <a href='/foxxie/privacy' className='flex items-center space-x-2 font-[550] duration-200 hover:text-gray-500 hover:underline'>
                                    <MdPolicy />
                                    <span>Privacy</span>
                                </a>
                            </li>
                        </ul>

                        <span className='rounded-full p-2 text-2xl text-gray-600 duration-200 hover:cursor-pointer hover:bg-gray-200'>
                            <MdLibraryBooks />
                        </span>
                    </div>
                </div>
            </header>
        </>
    );
}
