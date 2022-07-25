/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '../assets/images';
import Head from 'next/head';
import AboutMeMain from '../components/pages/about-me/AboutMeMain';
import AllProjects from '../components/pages/my-work/all-projects/AllProjects';
import WorkHeader from '../components/pages/my-work/header/WorkHeader';

const AboutMe: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='Take a look at my personal projects'
                description='Here are my most prevelent projects. All designed to help make our lives easier, and show off my work.'
                openGraph={{
                    title: 'Take a look at my personal projects',
                    description: 'Here are my most prevelent projects. All designed to help make our lives easier, and show off my work.'
                }}
            />

            <AboutMeMain>
                <WorkHeader />
                <AllProjects />
            </AboutMeMain>
        </>
    );
};

export default AboutMe;
