import { MdLanguage } from 'react-icons/md';
import Link from './Link/Link';
import LocaleSelector from './LocaleSelector';

export default function HomeFooter({ className }: { className?: string }) {
    return (
        <footer className={`bottom-0 w-full bg-gray-50 px-3 ${className}`}>
            <div className='flex w-full items-center justify-end border-b-2 py-3'>
                <LocaleSelector />
                <MdLanguage className='mx-5 my-3 text-lg md:text-xl' />
            </div>

            <div className='border-b-gray flex flex-col items-start space-y-5 border-b-2 py-6 px-4 md:flex-row md:space-y-0 md:space-x-20'>
                <div className='border-b-gray flex flex-col items-start py-6 px-4'>
                    <h2 className='text-[16px] font-medium text-black'>Resources</h2>
                    <ul className='mt-5 space-y-3'>
                        <li className='text-gray-700 duration-200 hover:text-gray-600'>
                            <Link className='text-[16px] font-medium' href='/contact-me'>
                                Contact me
                            </Link>
                        </li>
                        <li className='text-gray-700 duration-200 hover:text-gray-600'>
                            <Link className='text-[16px] font-medium' href='/about-me/location'>
                                Location
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className='flex flex-col items-start py-6 px-4'>
                    <h2 className='text-[16px] font-medium'>Projects</h2>
                    <ul className='mt-5 space-y-3'>
                        <li className='text-gray-700 duration-200 hover:text-gray-600'>
                            <Link className='text-[16px] font-medium' href='/cdn'>
                                Cdn
                            </Link>
                        </li>
                        <li className='text-gray-700 duration-200 hover:text-gray-600'>
                            <Link className='text-[16px] font-medium' href='/foxxie/about'>
                                Foxxie
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className='flex items-center justify-start space-x-3'>
                <Link href='/' className='my-1 rounded-md py-4 px-3 text-xl font-medium text-gray-600'>
                    Reese Harlak
                </Link>
            </div>
        </footer>
    );
}
