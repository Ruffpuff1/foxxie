import { MdLanguage } from 'react-icons/md';
import LocaleSelector from './LocaleSelector';

export default function HomeFooter() {
    return (
        <footer className='flex fixed bottom-3 items-center w-full justify-end'>
            <div className='flex items-center'>
                <LocaleSelector />
                <MdLanguage className='text-xl mx-5 my-3' />
            </div>
        </footer>
    );
}