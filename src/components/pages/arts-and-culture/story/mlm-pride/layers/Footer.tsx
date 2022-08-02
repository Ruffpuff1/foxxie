import React from 'react';
import Image from 'next/image';
import Items from '@arts-culture/museum/Items';
import { assets } from '@assets/arts-and-culture/data';

export default function Footer({ art }: { art: string[] }) {
    return (
        <footer id='footer' className='mb-20 flex h-[100vh] flex-col items-center bg-white pt-20'>
            <div className='h-[1px] w-96 bg-gray-200' />

            <div className='mt-10 flex w-96 flex-col'>
                <div>
                    <h2 className='text-lg opacity-90'>Credits</h2>
                </div>

                <div className='mt-10 flex w-full flex-col items-center'>
                    <a
                        target='_blank'
                        rel='noreferrer'
                        href='https://foundation.wikimedia.org/wiki/Home'
                        className=' flex flex-col items-center rounded-md p-2 duration-200 hover:bg-gray-100'
                    >
                        <Image src='/wikipedia_logo.svg' className='h-20 w-20' width={80} height={80} alt='Wikipedia' />
                        <h2 className='mt-2 text-sm font-[300] tracking-[.01785714em] text-black opacity-90'>Wikipedia</h2>
                    </a>
                </div>
            </div>

            <div className='mt-36' />

            <Items title='Featured Assets' art={assets.filter(a => art?.includes(a.id))} />
        </footer>
    );
}
