import { MdLanguage } from 'react-icons/md';
import LocaleSelector from './LocaleSelector';

export default function HomeFooter() {
    return (
        <footer className='fixed bottom-3 flex w-full items-center justify-end'>
            <div className='flex items-center'>
                <LocaleSelector />
                <MdLanguage className='mx-5 my-3 text-xl' />
            </div>
        </footer>
    );
}
