import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '@assets/images';
import Head from 'next/head';
import PumpkinParallax from '@about-me/dogs/pumpkin/ui/PumpkinParallax/PumpkinParallax';

const Pumpkin: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='Pumpkin Through the Years'
                description=''
                openGraph={{
                    title: 'Pumpkin Through the Years',
                    description: ''
                }}
            />

            <div className='flex h-screen w-screen items-center justify-center 2xl:hidden'>
                <h1 className='mb-10 text-xl'>Please view this page on a larger screen</h1>
            </div>
            <PumpkinParallax />
        </>
    );
};

export default Pumpkin;
