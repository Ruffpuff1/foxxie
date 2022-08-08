import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '@assets/images';
import Head from 'next/head';
import Navbar from '@about-me/Navbar';
import PumpkinParallax from '@about-me/dogs/pumpkin/PumpkinParallax/PumpkinParallax';

const Pumpkin: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='Pumpkin'
                description=''
                openGraph={{
                    title: 'Pumpkin',
                    description: ''
                }}
            />

            <Navbar />
            <PumpkinParallax />
        </>
    );
};

export default Pumpkin;
