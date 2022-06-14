import { MdLanguage } from 'react-icons/md';
import LocaleSelector from './LocaleSelector';

export default function HomeFooter() {
    const contact = '/about/contact-me';

    return (
        <footer className='mt-[23.5rem] w-full bg-gray-100 px-3 md:mt-[19rem]'>
            <div className='flex items-center justify-end border-b py-3 w-full'>
                <LocaleSelector />
                <MdLanguage className='mx-5 my-3 text-xl' />
            </div>
            <div className='py-6 px-2 flex flex-col items-start'>
                <h2 className='font-[500] text-lg'>Resources</h2>
                <ul className='mt-5'>
                    <li>
                        <a href={contact}>
                            Contact me
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
