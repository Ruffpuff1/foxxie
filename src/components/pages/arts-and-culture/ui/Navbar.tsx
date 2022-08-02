/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useClickOutside } from '@ruffpuff/usehooks';
import Link from 'next/link';
import { useState } from 'react';
import { MdArrowBack, MdLocationOn, MdMenu, MdOutlineAccountBalance, MdOutlineCollectionsBookmark, MdOutlineHome, MdSearch } from 'react-icons/md';
import Search from './Search';

export default function Navbar({ visible, show, hide, back }: Props) {
    const [openPanel, setOpenPanel] = useState(false);
    const [panelRef] = useClickOutside<HTMLDivElement>(() => {
        if (openPanel) setOpenPanel(false);
    });

    const [showSearch, setShowSearch] = useState(false);

    return (
        <>
            <header
                className={`fixed ${show === false ? 'top-[-20rem]' : 'top-0'} z-[40] flex h-[60px] w-full items-center justify-between py-1 shadow-lg duration-200 ${
                    visible ? 'bg-white text-[#444444]' : 'bg-transparent text-white'
                }`}
            >
                <div className='flex items-center space-x-2'>
                    <div className='flex h-[56px] items-center justify-between'>
                        {back?.show ? (
                            <button
                                onClick={() => {
                                    back.onClick();
                                }}
                                className={`ml-3 flex h-12 w-12 items-center justify-center rounded-full ${
                                    visible ? 'active:bg-gray-100' : 'bg-opacity-50 active:bg-black'
                                }`}
                            >
                                <MdArrowBack className='text-2xl' />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setOpenPanel(true);
                                }}
                                className={`ml-3 flex h-12 w-12 items-center justify-center rounded-full ${
                                    visible ? 'active:bg-gray-100' : 'bg-opacity-50 active:bg-black'
                                }`}
                            >
                                <MdMenu className='text-2xl' />
                            </button>
                        )}
                    </div>
                    <h1 className='space-x-1 text-lg font-[400]'>
                        <a href='/arts-and-culture' className={`rounded-md py-2 px-1 ${visible ? 'hover:bg-gray-100' : 'bg-opacity-50 hover:bg-black'}`}>
                            <span className='font-[450]'>Reese </span>
                            <span>Arts & Culture</span>
                        </a>
                        {!hide && <span className={`${visible ? 'text-[#777777]' : 'text-gray-300'}`}>Pride Project</span>}
                    </h1>
                </div>

                <div className='flex items-center'>
                    <div className='flex h-[56px] items-center justify-between'>
                        <button
                            onClick={() => {
                                setShowSearch(true);
                            }}
                            className='mr-3 flex h-12 w-12 items-center justify-center rounded-full active:bg-gray-200'
                        >
                            <MdSearch className='text-2xl' />
                        </button>
                    </div>
                </div>
            </header>

            <nav
                ref={panelRef}
                className={`trs fixed top-0 left-0 z-[50] h-full overflow-x-hidden bg-white shadow-md ${openPanel && show !== false ? 'w-[290px]' : 'w-0'}`}
            >
                <div className='mb-3 flex h-[56px] items-center justify-between border-b'>
                    <button
                        onClick={() => {
                            setOpenPanel(false);
                        }}
                        className='ml-3 flex h-12 w-12 items-center justify-center rounded-full active:bg-gray-200'
                    >
                        <MdMenu className='text-2xl' />
                    </button>
                </div>

                <ul className='block'>
                    <li className='list-item'>
                        <a
                            href='/arts-and-culture'
                            className='ml-2 flex w-[calc(100%-8px)] items-center text-ellipsis rounded-l-3xl pr-6 pl-3 text-center text-[.875rem] font-[500] leading-[48px] text-[#3c4043] active:bg-blue-100 active:text-blue-500'
                        >
                            <MdOutlineHome className='mr-4 h-6 w-6' />
                            Home
                        </a>
                    </li>
                </ul>

                <ul className='block'>
                    <li className='list-item'>
                        <Link href='/arts-and-culture/museum'>
                            <a className='ml-2 flex w-[calc(100%-8px)] items-center text-ellipsis rounded-l-3xl pr-6 pl-3 text-center text-[.875rem] font-[500] leading-[48px] text-[#3c4043] active:bg-blue-100 active:text-blue-500'>
                                <MdOutlineAccountBalance className='mr-4 h-6 w-6' />
                                Museums
                            </a>
                        </Link>
                    </li>

                    <li className='list-item'>
                        <a
                            href='/arts-and-culture/project'
                            className='ml-2 flex w-[calc(100%-8px)] items-center text-ellipsis rounded-l-3xl pr-6 pl-3 text-center text-[.875rem] font-[500] leading-[48px] text-[#3c4043] active:bg-blue-100 active:text-blue-500'
                        >
                            <MdOutlineCollectionsBookmark className='mr-4 h-6 w-6' />
                            Themes
                        </a>
                    </li>

                    <li className='list-item'>
                        <a
                            href='/arts-and-culture/category/place'
                            className='ml-2 flex w-[calc(100%-8px)] items-center text-ellipsis rounded-l-3xl pr-6 pl-3 text-center text-[.875rem] font-[500] leading-[48px] text-[#3c4043] active:bg-blue-100 active:text-blue-500'
                        >
                            <MdLocationOn className='mr-4 h-6 w-6' />
                            Places
                        </a>
                    </li>
                </ul>
            </nav>

            <Search show={showSearch} setShow={setShowSearch} />
        </>
    );
}

interface Props {
    visible: boolean;
    emailSubject?: string;
    emailBody?: string;
    hide?: boolean;
    show?: boolean;
    back?: Back;
}

interface Back {
    show: boolean;
    onClick: () => void;
}
