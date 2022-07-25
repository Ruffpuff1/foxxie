import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '../assets/images';
import HomeAboutSection from '../components/pages/home/HomeAboutSection';
import Main from '../components/ui/Main';
import Head from 'next/head';
import HomeTopSection from '../components/pages/home/HomeTopSection';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='Reese Harlak - My Personal Website'
                description="Hi I'm Reese, a web developer and musician."
                openGraph={{
                    title: 'Reese Harlak - My Personal Website',
                    description: "Hi I'm Reese, a web developer and musician."
                }}
            />

            <Main>
                <HomeTopSection />
                <HomeAboutSection />
                {/* <section className='flex h-[900px] flex-col items-center justify-center'></section> */}
            </Main>
        </>
    );
};

export default Home;
