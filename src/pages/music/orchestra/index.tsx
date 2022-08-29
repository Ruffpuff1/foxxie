import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import Navbar from '@ui/Navbar/Navbar';
import type { NextPage } from 'next';

const Music: NextPage = () => {
    return (
        <>
            <Meta title='Orchestra' description='' icon='https://reese.cafe/images/icons/violin.png' noRobots />

            <Navbar
                noHoverIndicators
                home='/music'
                links={[{ path: '/music/orchestra', text: 'Orchestra' }]}
                title=' Music'
                icon='https://reese.cafe/images/icons/violin.png'
            />

            <div className='mt-20 flex flex-col items-start justify-start'>
                <h1 className='p-10 pb-5 text-4xl'>Orchestra</h1>

                <div className='flex h-full w-full grid-cols-3 flex-col items-center p-10 md:grid'>
                    <Link href='/music/orchestra/emhs' className='h-80 w-72 overflow-hidden rounded-b-md border bg-white duration-200 hover:rounded-t-md hover:shadow-lg'>
                        <div
                            className='h-32 bg-cover bg-no-repeat'
                            style={{ backgroundImage: `url('https://reese.cafe/images/assets/music/orchestra-banners/emhs.jpg')` }}
                        />

                        <div className='p-2'>
                            <span className='text-xs text-gray-500'>2019 - 2023</span>
                            <h1 className='text-[17px] font-[500]'>El Modena High School Orchestra</h1>
                            <h2 className='text-[13px] font-[400] text-gray-800'>Dirrected by Derrick Nuño, formerly Brian Glahn</h2>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Music;
