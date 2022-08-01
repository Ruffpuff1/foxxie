import { paintings, photographs, sculptures } from '@assets/arts-and-culture/data';
import { toTitleCase } from '@ruffpuff/utilities';

export default function PhotographDetails({ id }: { id: string }) {
    const asset =
        photographs.find(photograph => photograph.id === id)! || sculptures.find(sculpture => sculpture.id === id) || paintings.find(painting => painting.id === id);
    const creatorName = asset.creatorDisplayName || asset.creditLine;

    return (
        <div className='flex flex-col items-start text-sm tracking-wide'>
            <span className='space-x-2'>
                <span className='font-[450]'>Title:</span>
                <span className='text-gray-500'>{asset.name}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Creator:</span>
                <span className='text-gray-500'>{creatorName}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Date Created:</span>
                <span className='text-gray-500'>{asset.date}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Dimensions:</span>
                <span className='text-gray-500'>{asset.physicalDimensions}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Type:</span>
                <a href={`/arts-and-culture/entity/${asset.type}`} className='text-blue-500'>
                    {toTitleCase(asset.type)}
                </a>
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
                <span className='font-[450]'>Number:</span>
                <span className='text-gray-500'>{asset.number}</span>
            </span>

            {asset.culture && (
                <span className='space-x-2'>
                    <span className='font-[450]'>Culture:</span>
                    <span className='text-gray-500'>{asset.culture}</span>
                </span>
            )}

            <span className='space-x-2'>
                <span className='font-[450]'>Credit Line:</span>
                <span className='text-gray-500'>{asset.creditLine}</span>
            </span>

            <span className='space-x-2'>
                <span className='font-[450]'>Creator Display Name:</span>
                <span className='text-gray-500'>{asset.creatorDisplayName}</span>
            </span>

            {asset.classification && (
                <span className='space-x-2'>
                    <span className='font-[450]'>Classification:</span>
                    <span className='text-gray-500'>{asset.classification}</span>
                </span>
            )}
        </div>
    );
}
