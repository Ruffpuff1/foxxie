import { emhsConcerts } from '@assets/music/concerts';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import Navbar from '@ui/Navbar/Navbar';
import type { NextPage } from 'next';

const Emhs: NextPage = () => {
    return (
        <>
            <Meta title='El Modena High School Orchestra' description='' icon='https://reese.cafe/images/icons/violin.png' noRobots />

            <Navbar
                noHoverIndicators
                home='/music'
                links={[{ path: '/music/orchestra', text: 'Orchestra' }]}
                title=' Music'
                icon='https://reese.cafe/images/icons/violin.png'
            />

            <div>
                <div
                    className='mt-[64px] flex flex-col items-center justify-center bg-gray-50 bg-cover bg-no-repeat p-28 text-gray-50 md:h-[90vh]'
                    style={{ backgroundImage: `url('https://reese.cafe/images/assets/music/orchestra-banners/emhs.jpg')` }}
                >
                    <h1 className='select-none text-3xl md:text-5xl'>The El Modena High School Orchestra</h1>
                    <Link
                        className='mt-5 bg-[#C41230] px-10 py-4 duration-200 ease-in-out hover:bg-slate-900'
                        href={`/music/orchestra/emhs/${emhsConcerts[emhsConcerts.length - 1].path}`}
                    >
                        Latest Concert
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Emhs;
