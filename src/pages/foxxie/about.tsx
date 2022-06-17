import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import Head from 'next/head';
import FoxxieDiscordUI from '../../components/pages/foxxie/about/discord-ui/FoxxieDiscordUI';
import FoxxieFeaturesList from '../../components/pages/foxxie/about/discord-ui/FoxxieFeaturesList';
import Navbar from '../../components/pages/foxxie/about/ui/Navbar';
import useVisibility from '../../hooks/useVisibility';

const About: NextPage = () => {
    const [isVisible, atBottom, currentElement] = useVisibility<HTMLDivElement>();

    return (
        <div>
            <Head>
                <link rel='icon' href='https://cdn.reeseharlak.com/icons/foxxie.png' />
                <meta name='theme-color' content='#898489' />
            </Head>
            <NextSeo
                title='Foxxie: A moderation Discord bot for improving community servers'
                description='Foxxie is a moderation Discord bot designed to make managing community servers quick and easy. He comes with a variety of moderation commands as well as logging and information.'
                openGraph={{
                    title: 'Foxxie: A moderation Discord bot for improving community servers',
                    site_name: 'Foxxie: A moderation Discord bot for improving community servers',
                    description:
                        'Foxxie is a moderation Discord bot designed to make managing community servers quick and easy. He comes with a variety of moderation commands as well as logging and information.',
                    locale: 'en',
                    url: 'https://reeseharlak.com/foxxie/about'
                }}
                twitter={{
                    handle: '@Reeseharlak',
                    site: 'https://reeseharlak.com/foxxie/about'
                }}
            />

            <Navbar hide={isVisible} />

            <div id='top' className='h-[100vh]'>
                <div className='flex flex-col items-center px-20 pt-56 md:block'>
                    <h1 className='text-center text-3xl md:text-5xl xl:w-[30rem] xl:text-left'>Building communities made easy</h1>
                    <h2 className='mt-3 text-center text-lg text-gray-600 xl:w-96 xl:text-left'>Moderation, information, and logging. All through one tool.</h2>
                </div>

                <div aria-hidden='true' className='mt-60 flex items-center justify-center'>
                    <a href='#discord-ui' className='flex w-60 flex-col items-center rounded-md p-2 text-sm hover:bg-gray-100'>
                        Continue below to explore
                        <MdArrowDropDown className='text-xl' />
                    </a>
                </div>
            </div>

            <div ref={currentElement} aria-hidden='true' id='discord-ui'>
                <FoxxieFeaturesList />
                <FoxxieDiscordUI />
            </div>

            <div className='h-[100vh]'>
                d
                <a
                    href='#top'
                    aria-hidden='true'
                    className={`foxxie-bottom-scroll-up fixed right-5 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 shadow-md hover:shadow-xl ${
                        atBottom ? 'bottom-5' : 'bottom-[-50px]'
                    }`}
                >
                    <MdArrowDropUp className='text-xl' />
                </a>
            </div>
        </div>
    );
};

export default About;
