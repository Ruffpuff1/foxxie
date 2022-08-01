/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Navbar from '@arts-culture/ui/Navbar';
import { assets, entities } from '@assets/arts-and-culture/data';
import { useState } from 'react';
import Image from 'next/image';

const Place: NextPage = () => {
    const locations = entities.filter(e => e.type === 'location');

    const letters = [...new Set(locations.map(m => m.name.slice(0, 1)))].sort((a, b) => a.localeCompare(b));
    const [selectedLetter, setSelectedLetter] = useState(letters[0]);
    const index = letters.indexOf(selectedLetter);
    const [filter, setFilter] = useState<'all' | 'a-z'>('all');

    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/images/icons/museum.png' />
                <meta name='theme-color' content='#027B83' />
            </Head>
            <NextSeo
                title={`Places - Reese Arts & Culture`}
                description=''
                openGraph={{
                    title: `Places - Reese Arts & Culture`,
                    description: ''
                }}
            />

            <Navbar visible hide />

            <div className='left-0 top-[3rem] mt-[7rem] flex flex-col items-center'>
                <h1 className='text-3xl tracking-[.00625em]'>Places</h1>

                <div>
                    <div className='mt-5 flex w-[144px] items-center justify-between px-5'>
                        <button
                            className={`flex h-12 items-center justify-center text-sm ${filter === 'all' ? 'font-[500]' : 'text-gray-500'}`}
                            onClick={() => {
                                setFilter('all');
                            }}
                        >
                            All
                        </button>
                        <button
                            className={`flex h-12 items-center justify-center text-sm ${filter === 'a-z' ? 'font-[500]' : 'text-gray-500'}`}
                            onClick={() => {
                                setFilter('a-z');
                            }}
                        >
                            A-Z
                        </button>
                    </div>

                    <div className='h-1 w-[72px] bg-blue-500 duration-200 ease-in-out' style={{ marginLeft: `${filter === 'a-z' ? '72' : '0'}px` }} />
                </div>

                <div className='mx-20 mt-5 inline-block min-h-[40vh]'>
                    {filter === 'a-z' && (
                        <div className='block'>
                            <div className='relative mt-3 mb-5'>
                                <ul
                                    style={{
                                        transform: `translate3d(-${index}55.977px, 0px, 0px)`
                                    }}
                                    className='inline-block h-[60px] whitespace-nowrap px-[50%] text-center duration-1000'
                                >
                                    {letters.map((l, idx) => {
                                        return (
                                            <li
                                                onClick={() => {
                                                    setSelectedLetter(l);
                                                }}
                                                key={l}
                                                className={`mx-[30px] inline-flex h-[50px] w-[50px] items-center justify-center text-ellipsis rounded-full text-[16px] text-[#202124] hover:cursor-pointer ${
                                                    idx === index ? 'bg-gray-100' : ''
                                                }`}
                                            >
                                                {l}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className='flex flex-col flex-wrap items-center md:flex-row md:items-baseline md:justify-between'>
                        {locations
                            .filter(m => (filter === 'a-z' ? m.name.startsWith(selectedLetter) : true))
                            .map(m => {
                                const locAssets = assets.filter(a => a.entities?.includes(m.id));

                                return (
                                    <div key={m.id} className={`mx-2 pb-6 ${filter === 'a-z' ? `mus-card${m.name.startsWith(selectedLetter) ? '' : '-reverse'}` : ''}`}>
                                        <a className='block h-full w-full overflow-hidden text-[.875rem] font-[500] leading-[1.25rem]' href={m.page}>
                                            <div className='h-full w-full overflow-hidden'>
                                                <div className='h-36 w-[220px] overflow-hidden rounded-lg bg-gray-100'>
                                                    <Image
                                                        src={locAssets[0]?.image}
                                                        alt={m.name}
                                                        height={144}
                                                        width={220}
                                                        className='rounded-lg bg-cover bg-center duration-200 hover:scale-[1.1]'
                                                    />
                                                </div>
                                                <div className='w-full text-start'>
                                                    <h3 className='my-[6px] max-h-[4.5rem] max-w-[220px] text-ellipsis pr-1 text-[1rem] leading-[1.5rem] tracking-[.00625em]'>
                                                        {m.name}
                                                    </h3>
                                                    <h4 className='max-h-[2rem] overflow-hidden text-ellipsis pr-1 text-[.75rem] text-[#80868b]'>
                                                        {locAssets.length} Items
                                                    </h4>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Place;
