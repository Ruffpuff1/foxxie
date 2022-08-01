import { nasas } from '@assets/arts-and-culture/data';
import React from 'react';

export default function NasaDetails({ id }: { id: string }) {
    const asset = nasas.find(nasa => nasa.id === id)!;

    return (
        <div className='flex flex-col items-start text-sm tracking-wide'>
            <span className='space-x-2'>
                <span className='font-[450]'>Title:</span>
                <span className='text-gray-500'>{asset.name}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Creator:</span>
                <span className='text-gray-500'>{asset.creatorDisplayName}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Date Created:</span>
                <span className='text-gray-500'>{asset.date}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>External Link:</span>
                <a target='_blank' rel='noreferrer' href={asset.externalLink} className='text-blue-500'>
                    {asset.externalLink}
                </a>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Terms of Use:</span>
                <span className='text-gray-500'>{asset.termsOfUse}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Credit Line:</span>
                <span className='text-gray-500'>{asset.creditLine}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Creator Display Name:</span>
                <span className='text-gray-500'>{asset.creatorDisplayName}</span>
            </span>
        </div>
    );
}
