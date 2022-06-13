import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <link rel='icon' href='' />
                <meta name='theme-color' content='' />
            </Head>
            <NextSeo title='' description='' />

            <body>Welcome Home.</body>
        </div>
    );
};

export default Home;
