/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '../../assets/images';
import Head from 'next/head';
import AboutMeMain from '../../components/pages/about-me/AboutMeMain';
import Header from '../../components/pages/about-me/Header';
import Article from '../../components/pages/about-me/Article';

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

            <AboutMeMain>
                <Header />
                <Article />
            </AboutMeMain>
        </>
    );
};

export default AboutMe;
