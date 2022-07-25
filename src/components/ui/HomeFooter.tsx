import { useRouter } from 'next/router';
import { MdLanguage } from 'react-icons/md';
import LocaleSelector from './LocaleSelector';

export default function HomeFooter({ className }: { className?: string }) {
    const router = useRouter();

    return (
        <footer className={`bottom-0 w-full bg-gray-50 px-3 ${className}`}>
            <div className='flex w-full items-center justify-end border-b-2 py-3'>
                <LocaleSelector />
                <MdLanguage className='mx-5 my-3 text-lg md:text-xl' />
            </div>

            <div className='border-b-gray flex flex-col items-start border-b-2 py-6 px-4'>
                <h2 className='text-[16px] font-[550]'>Resources</h2>
                <ul className='mt-5 space-y-3'>
                    <li className='text-gray-700 duration-200 hover:text-gray-600'>
                        <button role='link' className='text-[16px] font-[450]' onClick={() => router.push('/contact-me')}>
                            Contact me
                        </button>
                    </li>
                    {/* <li className='text-gray-700 duration-200 hover:text-gray-600'>
                        <button role='link' className='text-[16px] font-[450]' onClick={() => router.push('/hire')}>
                            Hire
                        </button>
                    </li> */}
                    <li className='text-gray-700 duration-200 hover:text-gray-600'>
                        <button role='link' className='text-[16px] font-[450]' onClick={() => router.push('/about-me/location')}>
                            Location
                        </button>
                    </li>
                </ul>
            </div>

            <div className='flex items-center justify-start space-x-3'>
                <button role='link' onClick={() => router.push('/')} className='my-1 rounded-md py-4 px-3 text-xl font-[500] text-gray-600'>
                    Reese Harlak
                </button>
            </div>
        </footer>
    );
}
