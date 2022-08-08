import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '@assets/images';
import Head from 'next/head';
import AboutMain from '@about-me/AboutMain';
import LocationMap from '@about-me/location/LocationMap';

const Location: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='About Me - Reese Harlak'
                description='Learn more about me, my projects, and contact me if you would like to talk about potential projects.'
                openGraph={{
                    title: 'About Me - Reese Harlak',
                    description: 'Learn more about me, my projects, and contact me if you would like to talk about potential projects.'
                }}
            />

            <AboutMain>
                <h1 className='mt-20 flex justify-center py-5 text-xl md:text-2xl'>My location</h1>
                <LocationMap />
                <h2 className='mx:text-xl mb-40 flex justify-center py-5 text-lg'>
                    Born and raised in Orange County, California.
                    <br />
                </h2>
            </AboutMain>
        </>
    );
};

export default Location;
