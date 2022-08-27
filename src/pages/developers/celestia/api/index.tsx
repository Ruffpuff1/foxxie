import { Icons } from '@assets/images';
import Navbar from '@developers/celestia/Navbar/Navbar';
import Footer from '@developers/Footer/Footer';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const API: NextPage = () => {
    const [{ developers }] = useLocale();
    const { celestia } = developers;
    const { api } = celestia;

    return (
        <>
            <Meta title={`${api.title} | Celestia`} description={api.description} icon={Icons.Celestia} noRobots />

            <Navbar title={api.title} />

            <div className='h-[100vh] border-b pt-[4rem]'>
                <div className='flex h-[32rem] w-full flex-col items-start justify-between px-10 pt-28 md:flex-row'>
                    <h1 className='text-3xl'>{api.title}</h1>

                    <div className='mt-10 h-full w-full bg-amber-300 md:mt-0 md:w-[50%]'></div>
                </div>

                <div className='mt-16 grid space-y-16 px-10 md:grid-cols-3 md:space-y-0'>
                    <div className='inline-block'>
                        <h2 className='text-xl tracking-wide text-blue-500 hover:underline'>
                            <Link href='/developers/celestia/api/guides/concepts'>{api.getStarted}</Link>
                        </h2>
                        <p className='mt-4 text-base font-[350] tracking-wide'>{api.getStartedDescription}</p>
                    </div>

                    <div className='inline-block'>
                        <h2 className='text-xl tracking-wide text-blue-500 hover:underline'>
                            <Link href='/developers/celestia/api/refrence'>{api.documentation}</Link>
                        </h2>
                        <p className='mt-4 text-base font-[350] tracking-wide'>{api.documentationDescription}</p>
                    </div>
                </div>
            </div>

            <Footer full />
        </>
    );
};

export default API;
