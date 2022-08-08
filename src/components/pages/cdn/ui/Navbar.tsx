import AuthInformation from '@auth/AuthInformation';
import Image from 'next/image';
import { SidebarContext } from '@hooks/useTodo';
import { useContext } from 'react';

export default function Navbar() {
    const { showTodo } = useContext(SidebarContext);

    return (
        <header className='fixed top-0 right-0 z-[0.4] flex w-full items-center justify-between border-b border-b-gray-200 bg-white px-2 py-1 shadow-md duration-200 sm:shadow-sm md:px-3'>
            <div className='flex items-center space-x-2 py-3'>
                <Image height={32} width={32} src='https://reese.cafe/images/icons/upload.png' alt='Cdn' />
                <a href='/cdn' className='text-2xl text-gray-500 duration-200 hover:text-blue-500 hover:underline'>
                    Cdn
                </a>
            </div>

            <AuthInformation signOutPath='/cdn' shiftLeft={showTodo} />
        </header>
    );
}
