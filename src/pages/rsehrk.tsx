import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import Navbar from '@ui/Navbar/Navbar';
import type { NextPage } from 'next';

const Rsehrk: NextPage = () => {
    const [{ developers }] = useLocale();

    return (
        <>
            <Meta
                title='Rsehrk Links: Link Shortener'
                description='Rsehrk links are shortened links that go to my projects, services, and websites I deem useful.'
                image={{ image: 'https://reese.cafe/images/icons/link.png', format: 'png', alt: 'Link' }}
                noRobots
            />

            <Navbar title=' Rsehrk Links' noReese icon='https://reese.cafe/images/icons/link.png' noHoverIndicators links={[]} />

            <div className='ml-60 mt-36 flex flex-col items-start'>
                <h1 className='text-lg font-[550]'>About rsehrk.com</h1>
                <p className='mt-5 text-sm text-gray-500'>
                    Rsehrk.com is a private link shortener service used for quick linking to different <span className='font-[550]'>reese.cafe</span> sites.
                </p>
                <p className='mt-5 text-sm text-gray-500'>Any &quot;rsehrk.com&quot; site will send you to a website I own or I deem useful.</p>
            </div>

            <footer className='fixed bottom-0 left-0 flex h-14 w-full items-center justify-start bg-gray-100 pl-10 text-sm text-gray-700'>
                <Link href='/policies/privacy'>{developers.footer.privacy}</Link>
            </footer>
        </>
    );
};

export default Rsehrk;
