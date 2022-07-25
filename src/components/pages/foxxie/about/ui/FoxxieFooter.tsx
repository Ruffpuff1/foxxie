import { MdArrowUpward } from 'react-icons/md';
/* eslint-disable @next/next/no-html-link-for-pages */

export default function FoxxieFooter() {
    return (
        <footer className='flex w-full flex-col items-start justify-between bg-gray-50 p-5 md:flex-row md:items-center'>
            <div>
                <a href='#top' className='flex items-center space-x-2 text-sm text-gray-700 duration-200 hover:text-gray-500'>
                    <MdArrowUpward />
                    <span>Back to top</span>
                </a>
            </div>

            <div>
                <p className='m-1 text-xs text-gray-700 md:text-sm'>
                    <span>Copyright © 2021 - 2022</span>{' '}
                    <a href='/' className='duration-200 hover:text-gray-500 hover:underline'>
                        Reese Harlak
                    </a>{' '}
                    <span>&</span>{' '}
                    <a href='mailto:rain.anguiano@reese.cafe' className='duration-200 hover:text-gray-500 hover:underline'>
                        Rain Anguiano
                    </a>
                    <span>. All rights reserved.</span>
                </p>
            </div>
        </footer>
    );
}
