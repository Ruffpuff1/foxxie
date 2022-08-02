import AuthInformation from '@auth/AuthInformation';
import { AuthProvider } from '@hooks/useAuth';
import useNavbarScroll from '@hooks/useNavbarScroll';
import NavbarPageName from '@ui/NavbarPageName';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';
import BaseNavbar, { Link } from '../../ui/BaseNavbar';

const Links: Link[] = [
    {
        text: 'About',
        path: '/about-me'
    },
    {
        text: 'My Work',
        path: '/my-work'
    },
    {
        text: 'Contact',
        path: '/contact-me'
    }
];

export default function AboutMeNavbar() {
    const router = useRouter();
    const [stick, scrolled] = useNavbarScroll();
    const [showPanel, setShowPanel] = useState(false);

    return (
        <>
            <header
                id='navbar'
                className={`fixed z-40 flex h-[60px] w-full items-center justify-between space-x-4 bg-white py-2 pl-3 pr-[40%] ${
                    scrolled ? 'border-b border-b-gray-200' : 'border-b border-b-gray-200 shadow-sm md:border-none md:shadow-none'
                } ${stick ? 'top-0 shadow-md' : 'top-[-75px]'}`}
            >
                <div className='flex items-center justify-start'>
                    <button
                        className='block rounded-full px-2 duration-200 hover:bg-gray-100 md:hidden'
                        onClick={() => {
                            setShowPanel(true);
                        }}
                    >
                        <MdMenu className='text-2xl' />
                    </button>
                    <NavbarPageName name={' About'} link={'/about'} />
                </div>

                <div className='hidden items-center justify-center space-x-6 whitespace-nowrap px-4 md:flex'>
                    {Links.map(link => {
                        return (
                            <button
                                key={link.path}
                                onClick={e => {
                                    e.preventDefault();
                                    return router.push(link.path);
                                }}
                                className={`border-b-[3px] px-3 ${
                                    router.pathname === link.path
                                        ? 'rounded-t-md border-b-blue-500 py-5'
                                        : 'my-1 rounded-md border-b-transparent py-4 duration-200 hover:bg-gray-100 hover:underline'
                                }`}
                            >
                                {link.text}
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className={`fixed top-0 z-[50] h-full w-full bg-black bg-opacity-30 ${showPanel ? 'block' : 'hidden'}`} />

            <div className={`fixed top-0 left-0 z-[60] h-full overflow-x-hidden whitespace-nowrap bg-white duration-200 ${showPanel ? 'w-60' : 'w-0'}`}>
                <div className='flex items-center justify-start py-2 px-3 shadow-md'>
                    <button
                        className='block rounded-full p-2 duration-200 hover:bg-gray-100 md:hidden'
                        onClick={() => {
                            setShowPanel(false);
                        }}
                    >
                        <MdClose className='text-2xl' />
                    </button>
                    <NavbarPageName name={' About'} link={'/about'} />
                </div>

                <ul className='mt-10 flex w-60 flex-col items-start'>
                    {Links.map(link => {
                        return (
                            <li key={link.text} className='w-full py-5 duration-200 hover:bg-gray-100'>
                                <a href={link.path} className='w-60 px-3'>
                                    {link.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
