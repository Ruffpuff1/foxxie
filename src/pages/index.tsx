import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Homepage from '../components/pages/Homepage';

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <link rel='icon' href='https://cdn.ruffpuff.dev/reese.jpg' />
                <meta name='theme-color' content='#000000' />
            </Head>
            <NextSeo
                title='Reese Harlak - My Personal Website'
                description="Hi I'm Reese, a web developer and musician."
                openGraph={{
                    title: 'Reese Harlak - My Personal Website',
                    description: 'Hi I\'m Reese, a web developer and musician.'
                }}
            />

            <Homepage />
        </div>
    );
};

export default Home;
