import Meta from '@ui/Meta';
import Navbar from '@ui/Navbar/Navbar';
import type { NextPage } from 'next';

const Rsehrk: NextPage = () => {
    return (
        <>
            <Meta
                title='Rsehrk Links: Link Shortener'
                description=''
                image={{ image: 'https://reese.cafe/images/icons/link.png', format: 'png', alt: 'Link' }}
                noRobots
            />

            <Navbar
                title=' rsehrk.com'
                noHoverIndicators
                links={[
                    {
                        path: '/',
                        text: 'Home'
                    }
                ]}
            />

            <div className='ml-60 mt-36 flex flex-col items-start'>
                <h1 className='text-lg font-[550]'>About rsehrk.com</h1>
                <p className='mt-5 text-sm text-gray-500'>
                    Rsehrk.com is a private link shortener service used for quick linking to different <span className='font-[550]'>reese.cafe</span> sites.
                </p>
                <p className='mt-5 text-sm text-gray-500'>Any &quot;rsehrk.com&quot; site will send you to a website I own or I deem useful.</p>
            </div>
        </>
    );
};

export default Rsehrk;
