import { MdLanguage } from 'react-icons/md';
import LocaleSelector from './LocaleSelector';

export default function HomeFooter() {
    return (
        <footer className='fixed bottom-0 w-full bg-gray-50 px-3 md:mt-[19rem]'>
            <div className='flex w-full items-center justify-end border-b py-3'>
                <LocaleSelector />
                <MdLanguage className='mx-5 my-3 text-lg md:text-xl' />
            </div>
        </footer>
    );
}
