import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import FoxxieDiscordUI from '../../components/pages/foxxie/about/discord-ui/FoxxieDiscordUI';
import FoxxieFeaturesList from '../../components/pages/foxxie/about/discord-ui/FoxxieFeaturesList';
import Navbar from '../../components/pages/foxxie/about/ui/Navbar';
import useVisibility from '../../hooks/useVisibility';
import { NextSeo } from 'next-seo';

const About: NextPage = () => {
    const [visible, , ref] = useVisibility<HTMLDivElement>();
    const router = useRouter();

    return (
        <>
            <Head>
                <link rel='icon' href='https://cdn.reese.cafe/icons/foxxie.png' />
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

            <Navbar hide={visible} />

            <section className='flex h-[100vh] flex-col items-center justify-center xl:items-start'>
                <div className='mx-10 mb-10 space-y-5 text-center'>
                    <h1 className='text-3xl'>Building communities made easy</h1>
                    <h2 className='mt-3 text-center text-lg text-gray-600 xl:w-96 xl:text-left'>Moderation, information, and logging. All through one tool.</h2>
                </div>

                <button onClick={() => router.push('/community')} className='rounded-md bg-blue-500 p-3 text-white xl:hidden'>
                    Join the Server
                </button>
            </section>

            <section ref={ref} className=''>
                <FoxxieDiscordUI />
                <FoxxieFeaturesList />
            </section>

            <section className='h-[100vh]'></section>
        </>
    );
};

export default About;
