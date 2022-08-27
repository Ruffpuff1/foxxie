import { Icons } from '@assets/images';
import Navbar from '@developers/celestia/Navbar/Navbar';
import Footer from '@developers/Footer/Footer';
import useLocale from '@hooks/useLocale';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const Celestia: NextPage = () => {
    const [{ developers }] = useLocale();
    const { celestia } = developers;

    return (
        <>
            <Meta title={celestia.title} description={celestia.description} icon={Icons.Celestia} noRobots />

            <Navbar />

            <div className='h-[100vh] pt-[4rem]'>
                <div className='flex h-[32rem] w-full items-start justify-between px-10 pt-28'>
                    <h1 className='text-3xl'>Fetch Animal Crossing Data</h1>
                </div>
            </div>

            <Footer full />
        </>
    );
};

export default Celestia;
