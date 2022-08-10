import Main from '@home/Main';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';
import Image from 'next/image';

const Pride: NextPage = () => {
    return (
        <>
            <Meta title='Pride: Coming soon' description='This is my Pride website, coming soon.' icon='https://reese.cafe/images/icons/rainbow.png' noRobots />

            <Main>
                <section className='flex h-screen flex-col items-center justify-center'>
                    <div className='flex items-center space-x-4'>
                        <Image height={64} width={64} className='h-16 w-16 resize-none' src='https://reese.cafe/images/icons/rainbow.png' alt='Rainbow' />

                        <div className='overflow-x-hidden'>
                            <h1 className='slide text-7xl font-medium uppercase text-purple-800'>Pride</h1>
                        </div>
                    </div>

                    <div>
                        <h2 className='text-2xl font-[450] text-[#333]'>Something special is coming soon. Stay tuned.</h2>

                        <h3 className='px-20 text-xl font-normal text-[#222]'>
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
