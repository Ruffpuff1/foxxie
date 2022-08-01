/* eslint-disable @next/next/no-img-element */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { assets, entities } from '@assets/arts-and-culture/data';
import Navbar from '@arts-culture/ui/Navbar';
import { useState } from 'react';
import Items from '@arts-culture/museum/Items';
import { Asset } from '@assets/arts-and-culture/structures';
import { textToComponent } from 'src/util/textToComponent';

const EntityPage: NextPage<Props> = ({ id }) => {
    const entity = entities.find(entity => entity.id === id)!;
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/images/icons/museum.png' />
                <meta name='theme-color' content='#027B83' />
            </Head>
            <NextSeo
                title={`${entity.name} - Reese Arts & Culture`}
                description={entity.description}
                openGraph={{
                    title: `${entity.name} - Reese Arts & Culture`,
                    description: entity.description
                }}
            />

            <Navbar visible hide />

            <div className='left-0 top-[3rem] mt-[5rem] flex flex-col items-center'>
                <div className='mt-5 flex w-full flex-col items-center justify-center px-5 md:px-20'>
                    <div className='mb-10 flex flex-col items-center'>
                        <h1 className='text-[1.8rem] font-[400] text-[#202124]'>{entity.name}</h1>
                        {/* <h2 className='text-[0.9rem] font-[400] text-gray-500'>{creatorName}</h2> */}
                    </div>

                    <div className='mb-20 max-w-[800px]'>
                        <div className={`mx-[24px] text-[.875rem] text-[#3c4043] ${showMore ? '' : 'max-h-[4.5em] overflow-hidden text-ellipsis'}`}>
                            {textToComponent(entity.description, entity)}
                        </div>
                        {entity.description.split('\n\n').length > 1 && (
                            <div className='mx-[24px] mt-[8px] text-[14px]'>
                                <button
                                    onClick={() => {
                                        setShowMore(!showMore);
                                    }}
                                    className='rounded-md py-1 pr-2 text-left text-blue-500 active:bg-blue-100'
                                >
                                    Read {showMore ? 'less' : 'more'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <Items art={assets.filter(a => a.entities?.includes(entity.id)) as Asset[]} />
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
    const path = params?.id as string;

    const entity = entities.find(c => c.id === path);

    if (!entity)
        return {
            notFound: true
        };

    return {
        props: {
            id: entity.id
        }
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: entities.map(l => ({
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

export default EntityPage;
