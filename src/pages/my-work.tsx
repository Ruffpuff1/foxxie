/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '../assets/images';
import Head from 'next/head';
import AboutMain from '@about-me/AboutMain';
import AllProjects from '@my-work/all-projects/AllProjects';
import WorkHeader from '@my-work/header/WorkHeader';
import WorkLatest from '@my-work/WorkLatest';

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

            <AboutMain>
                <WorkHeader />
                <WorkLatest />
                <AllProjects />
            </AboutMain>
        </>
    );
};

export default AboutMe;
