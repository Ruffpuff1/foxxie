import type { NextPage } from 'next';
import Main from '../components/pages/home/Main';
import useLocale from '../hooks/useLocale';

const NotFound: NextPage = () => {
    const [translations, hl] = useLocale();

    return (
        <>
            <Main>
                <div className='mt-[26rem] flex items-center justify-center text-4xl font-bold md:ml-20 md:justify-start md:text-6xl'>404</div>
                <h4 className='mb-[19.5rem] px-5 text-center text-gray-700 hover:text-gray-500 md:ml-16 md:text-start'>
                    <a href={hl && hl !== 'en_us' ? `/${hl}` : '/'}>{translations.notFound.tag}</a>
                </h4>
            </Main>
        </>
    );
};

export default NotFound;
