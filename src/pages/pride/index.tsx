import type { NextPage } from 'next';
import Main from 'src/components/pages/home/Main';
import Image from 'next/image';
import Head from 'next/head';

const Pride: NextPage = () => {
    return (
        <>
            <Head>
                <title>Pride: Coming soon</title>
                <link rel='icon' href='https://reese.cafe/images/icons/rainbow.png'></link>
            </Head>

            <Main>
                <section className='flex h-screen flex-col items-center justify-center'>
                    <div className='flex items-center space-x-4'>
                        <Image height={64} width={64} className='h-16 w-16 resize-none' src='https://reese.cafe/images/icons/rainbow.png' alt='Rainbow' />

                        <div className='overflow-x-hidden'>
                            <h1 className='slide text-7xl font-[500] uppercase text-purple-800'>Pride</h1>
                        </div>
                    </div>

                    <div>
                        <h2 className='text-2xl font-[450] text-[#333]'>Something special is coming soon. Stay tuned.</h2>

                        <h3 className='px-20 text-xl font-[400] text-[#222]'>
                            Email{' '}
                            <a className='underline hover:no-underline' href='mailto:pride@reese.cafe'>
                                pride@reese.cafe
                            </a>{' '}
                            with questions.
                        </h3>
                    </div>
                </section>
            </Main>
        </>
    );
};

export default Pride;
