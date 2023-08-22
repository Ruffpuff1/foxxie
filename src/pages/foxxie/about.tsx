import CardsSection from '@foxxie/about/cards-section/CardsSection';
import FeaturesLink from '@foxxie/about/features-section/FeaturesLink';
import FeaturesSection from '@foxxie/about/features-section/FeaturesSection';
import HeaderSection from '@foxxie/about/header-section/HeaderSection';
import FoxxieMain from '@foxxie/about/ui/FoxxieMain';
import Separator from '@foxxie/about/ui/Separator';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';
import { useState } from 'react';

const About: NextPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <Meta
                title='Foxxie: A tool for building Discord communities'
                description='Foxxie is a Discord bot for building community servers. With advanced moderation, information, and utility commands.'
                keywords={[
                    'reese',
                    'reese harlak',
                    'web',
                    'react',
                    'next.js',
                    'developer',
                    'foxxie',
                    'fox',
                    'discord',
                    'moderation',
                    'the corner store',
                    'community',
                    'community server'
                ]}
                subject='Site for Foxxie, a moderation Discord bot'
                image={{
                    image: 'https://rsehrk.com/images/icons/foxxie.png',
                    alt: 'A geometric Fox',
                    format: 'image/png'
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
