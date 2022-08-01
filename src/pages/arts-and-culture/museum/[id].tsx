/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable @next/next/no-img-element */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { assets, museums } from '@assets/arts-and-culture/data';
import Banner from '@arts-culture/museum/Banner/Banner';
import Navbar from '@arts-culture/ui/Navbar';
import Map from '@arts-culture/museum/Map/Map';
import OtherMuseums from '@arts-culture/museum/OtherMuseums';
import MuseumFooter from '@arts-culture/museum/MuseumFooter';
import Exhibits from '@arts-culture/museum/Exhibits';
import Items from '@arts-culture/museum/Items';
import { Asset } from '@assets/arts-and-culture/structures';

const Museum: NextPage<Props> = ({ id }) => {
    const museum = museums.find(m => m.id === id)!;

    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/images/icons/museum.png' />
                <meta name='theme-color' content='#027B83' />
            </Head>
            <NextSeo
                title={`${museum.name} - Reese Arts & Culture`}
                description={museum.description}
                openGraph={{
                    title: `${museum.name} - Reese Arts & Culture`,
                    description: museum.description
                }}
            />

            <Navbar visible hide />

            <div className='left-0 top-[3rem] mt-[3rem] flex flex-col items-center'>
                <Banner museum={museum} />

                <div className='flex w-full flex-col items-center'>
                    <div className='mt-8 mb-28 flex flex-col items-center px-5 md:px-28'>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-3xl font-[400] text-gray-700'>{museum.name}</h1>
                            <h2 className='text-xs font-[400] text-gray-600'>{museum.tag}</h2>
                        </div>

                        <p className='mt-10 text-sm text-gray-500 md:mx-40'>{museum.description}</p>
                    </div>

                    <Exhibits museum={museum} />
                    <OtherMuseums museum={museum} />
                    <Items art={assets.filter(a => a.museumId === museum.id) as Asset[]} />
                    <Map museum={museum} />
                </div>

                <MuseumFooter museum={museum} />
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
    const path = params?.id as string;
    const museum = museums.find(c => c.id === path);

    if (!museum)
        return {
            notFound: true
        };

    return {
        props: {
            id: museum.id
        }
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: museums.map(l => ({
            params: {
                id: l.id
            }
        })),

        fallback: 'blocking'
    };
};

interface Props {
    id: string;
}

export default Museum;
