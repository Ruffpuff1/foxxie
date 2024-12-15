import { Icons } from '@assets/images';
import Footer from '@developers/Footer/Footer';
import Navbar from '@developers/Navbar';
import useLocale from '@hooks/useLocale';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';

const Developers: NextPage = () => {
    const [{ developers }] = useLocale();

    return (
        <>
            <Meta title={developers.title} description={developers.description} icon={Icons.Developers} noRobots />

            <Navbar />

            <div className='h-[100vh] bg-white'>e</div>

            <Footer full />
        </>
    );
};

export default Developers;
