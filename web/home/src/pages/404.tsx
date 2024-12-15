import Main from '@home/Main';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const NotFound: NextPage = () => {
    const [translations] = useLocale();

    return (
        <>
            <Meta title='Not Found!1!!' description='This page could not be found.' noRobots />

            <Main>
                <div className='mt-[26rem] flex items-center justify-center text-4xl font-bold md:ml-20 md:justify-start md:text-6xl'>404</div>
                <h4 className='mb-[19.5rem] px-5 text-center text-gray-700 hover:text-gray-500 md:ml-16 md:text-start'>
                    <Link href='/'>{translations.notFound.tag}</Link>
                </h4>
            </Main>
        </>
    );
};

export default NotFound;
