import useLocale from '../../hooks/useLocale';
import HomeFooter from '../ui/HomeFooter';
import Navbar from '../ui/Navbar';

export default function Notfoundpage() {
    const [translations, hl] = useLocale();

    return (
        <>
            <Navbar />

            <div className='mt-56 flex items-center justify-center text-4xl font-bold md:ml-20 md:justify-start md:text-6xl'>404</div>
            <h4 className='px-5 text-center text-gray-700 hover:text-gray-500 md:ml-16 md:text-start'>
                <a href={hl && hl !== 'en_us' ? `/${hl}` : '/'}>{translations.notFound.tag}</a>
            </h4>

            <HomeFooter />
        </>
    );
}
