/* eslint-disable @next/next/no-img-element */
import { Villagers } from '@assets/celestia';
import { VillagerEnum } from '@assets/celestia/types';
import { Icons } from '@assets/images';
import Navbar from '@developers/celestia/Navbar/Navbar';
import Footer from '@developers/Footer/Footer';
import useLocale from '@hooks/useLocale';
import { toTitleCase } from '@ruffpuff/utilities';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import type { NextPage } from 'next';
import { useState } from 'react';

const villagerArray = [...Villagers.values()];

const API: NextPage = () => {
    const [{ developers }] = useLocale();
    const { celestia } = developers;
    const { api } = celestia;

    const [villager, setVillager] = useState(villagerArray[0]);

    return (
        <>
            <Meta title={`${api.title} | Celestia`} description={api.description} icon={Icons.Celestia} noRobots />
            <Navbar title={api.title} />

            <div className='h-[100vh] border-b pt-[4rem]'>
                <div className='flex h-[32rem] w-full flex-col items-start justify-between px-10 pt-28 md:flex-row'>
                    <h1 className='text-3xl'>{api.title}</h1>

                    <div className='mt-10 flex h-[80%] w-full items-start space-x-4 overflow-x-auto bg-amber-300 p-3 md:mt-0 md:h-full md:w-[50%]'>
                        <img src={villager.art} className='h-full w-auto select-none' alt={villager.key} />

                        <div className='flex flex-col'>
                            <h1 className='text-lg md:text-2xl'>
                                {toTitleCase(villager.key)} - {toTitleCase(villager.keyJp)}
                            </h1>
                            <p className='text-xs text-gray-700 md:text-sm'>{villager.description}</p>

                            <div className='mt-5'>
                                <h2 className='text-sm font-[500] md:text-base'>Endpoint:</h2>
                                <Link popup className='text-sm hover:underline md:text-base' href={`https://celestia.apis.reese.cafe/villagers/${villager.key}`}>
                                    celestia.apis.reese.cafe/villagers/{villager.key}
                                </Link>
                            </div>

                            <div className='mt-5'>
                                <select
                                    name='villager-select'
                                    className='rounded-md border bg-transparent px-3 py-[2px]'
                                    id='villager-select'
                                    onChange={e => {
                                        e.preventDefault();
                                        setVillager(Villagers.get(e.target.value as `${VillagerEnum}`)!);
                                    }}
                                >
                                    {villagerArray.map(vill => {
                                        return (
                                            <option key={vill.key} value={vill.key}>
                                                {toTitleCase(vill.key)}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-16 grid space-y-16 px-10 md:grid-cols-3 md:space-y-0'>
                    <div className='inline-block'>
                        <h2 className='text-xl tracking-wide text-blue-500 hover:underline'>
                            <Link href='/developers/celestia/api/guides/concepts'>{api.getStarted}</Link>
                        </h2>
                        <p className='mt-4 text-base font-[350] tracking-wide'>{api.getStartedDescription}</p>
                    </div>

                    <div className='inline-block'>
                        <h2 className='text-xl tracking-wide text-blue-500 hover:underline'>
                            <Link href='/developers/celestia/api/refrence'>{api.documentation}</Link>
                        </h2>
                        <p className='mt-4 text-base font-[350] tracking-wide'>{api.documentationDescription}</p>
                    </div>
                </div>
            </div>

            <Footer full />
        </>
    );
};

export default API;
