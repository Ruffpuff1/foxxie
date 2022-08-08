import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '@assets/images';
import Head from 'next/head';
import AboutMain from '@about-me/AboutMain';
import Header from '@about-me/Header';
import Article from '@about-me/Article';

const AboutMe: NextPage = () => {
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
                <Header />
                <Article />
            </AboutMain>
        </>
    );
};

export default AboutMe;
