/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import FoxxieMain from '../../components/pages/foxxie/about/ui/FoxxieMain';
import FeaturesSection from '../../components/pages/foxxie/about/features-section/FeaturesSection';
import HeaderSection from '../../components/pages/foxxie/about/header-section/HeaderSection';
import { useState } from 'react';
import Separator from '../../components/pages/foxxie/about/ui/Separator';
import FeaturesLink from '../../components/pages/foxxie/about/features-section/FeaturesLink';
import CardsSection from '../../components/pages/foxxie/about/cards-section/CardsSection';

const About: NextPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/icons/foxxie.png' />
                <meta name='theme-color' content='#000000' />
            </Head>
            <NextSeo
                title='Foxxie: A tool for building Discord communities'
                description='Foxxie is a Discord bot for building community servers. With advanced moderation, information, and utility commands.'
                openGraph={{
                    title: 'Foxxie - A tool for building Discord communities',
                    description: 'Foxxie is a Discord bot for building community servers. With advanced moderation, information, and utility commands.'
                }}
            />

            <FoxxieMain visible={isVisible}>
                <HeaderSection />
                <Separator />
                <FeaturesLink />
                <CardsSection />
                <FeaturesSection setIsVisible={setIsVisible} />
                <section className='h-[100vh]' />
            </FoxxieMain>
        </>
    );
};

export default About;
