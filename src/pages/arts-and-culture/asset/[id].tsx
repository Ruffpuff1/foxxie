/* eslint-disable @next/next/no-img-element */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import StitchedImage from '@arts-culture/asset/StitchedImage';
import { assets, museums, entities } from '@assets/arts-and-culture/data';
import { Asset, Nasa, Painting, Photograph, Sculpture } from '@assets/arts-and-culture/structures';
import NasaDetails from '@arts-culture/asset/details/NasaDetails';
import PhotographDetails from '@arts-culture/asset/details/PhotographDetails';
import { textToComponent } from 'src/util/textToComponent';

const AssetPage: NextPage<Props> = ({ id }) => {
    const asset = assets.find(asset => asset.id === id)!;
    const creatorName = asset.creatorDisplayName || asset.creditLine;
    const museum = asset.museumId ? museums.find(m => m.id === asset.museumId) : null;

    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/images/icons/museum.png' />
                <meta name='theme-color' content='#027B83' />
            </Head>
            <NextSeo
                title={`${asset.name} - Reese Arts & Culture`}
                description={asset.name}
                openGraph={{
                    title: `${asset.name} - Reese Arts & Culture`,
                    description: ''
                }}
            />

            <div className='left-0 top-[3rem] mt-[3rem] flex flex-col items-center px-5 md:px-20'>
                <StitchedImage art={asset} />

                <div className='mt-5 flex w-full items-center justify-between'>
                    <div className='flex flex-col items-start'>
                        <h1 className='text-[0.9rem] font-[500] text-[#202124]'>{asset.name}</h1>
                        <h2 className='text-[0.9rem] font-[400] text-gray-500'>{creatorName}</h2>
                    </div>

                    {museum && (
                        <a href={museum.page} className='flex flex-col items-end rounded-md p-1 duration-200 active:bg-gray-50'>
                            <h1 className='text-[0.9rem] font-[500] text-[#202124]'>{museum.name}</h1>
                            <h2 className='text-[0.9rem] font-[400] text-gray-500'>{museum.tag}</h2>
                        </a>
                    )}
                </div>

                <div className='mt-10 flex w-full items-start justify-start text-[0.8rem] tracking-wide text-gray-500 md:text-[1.03rem]'>
                    <p className='max-w-[1000px]'>{textToComponent(asset.description!, asset)}</p>
                </div>

                <div className='my-10 flex w-full flex-col items-start'>
                    <h2 className='mb-5 text-lg tracking-wide text-gray-500'>Details</h2>
                    {getDetails(asset)}
                </div>

                {asset.entities && (
                    <div className='mb-10 flex w-full flex-wrap items-center justify-start'>
                        <ul className='flex flex-wrap items-center space-x-5'>
                            {asset.entities.map(entity => {
                                const found = entities.find(e => e.id === entity);
                                if (!found) return null;

                                return (
                                    <li key={found.id}>
                                        <a href={found.page} className='rounded-full border-2 border-gray-500 p-2 px-3 text-sm text-gray-500'>
                                            {found.name}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
    const path = params?.id as string;

    const asset = assets.find(c => c.id === path);

    if (!asset)
        return {
            notFound: true
        };

    return {
        props: {
            id: asset.id
        }
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: assets.map(l => ({
            params: {
                id: l.id
            }
        })),

        fallback: 'blocking'
    };
};

function getDetails(asset: Asset) {
    if (asset instanceof Nasa) return <NasaDetails id={asset.id} />;
    if (asset instanceof Photograph || asset instanceof Sculpture || asset instanceof Painting) return <PhotographDetails id={asset.id} />;
}

interface Props {
    id: string;
}

export default AssetPage;
