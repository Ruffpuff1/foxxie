import { useClickOutside } from '@ruffpuff/usehooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdFolder } from 'react-icons/md';
import { Folder, FolderPath } from '@hooks/useFolder';

export default function FolderDots(props: { links: FolderPath[] | null; currentFolder: Folder; first: FolderPath }) {
    const router = useRouter();
    const [showRemaining, setShowRemaining] = useState(false);

    const [divRef] = useClickOutside<HTMLDivElement>(() => {
        setShowRemaining(false);
    }, [showRemaining]);

    return (
        <>
            <div className='flex items-center justify-center space-x-1' ref={divRef}>
                <button
                    onClick={() => {
                        setShowRemaining(!showRemaining);
                    }}
                    className={`rounded-md py-1 px-3 text-center text-xl font-semibold duration-500 ${
                        props.currentFolder?.name === props.first.name ? 'text-gray-400 hover:bg-gray-300' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    ...
                </button>
                <h2>/</h2>
            </div>
            <ul
                className={`fixed left-2 z-[0.3] w-72 overflow-y-hidden rounded-md rounded-t-none border-2 border-opacity-50 bg-white duration-200 lg:left-[22rem] ${
                    showRemaining ? `h-[${props.links!.length * 60}px] top-[7.6rem] border-gray-100 py-2 shadow-lg` : 'top-[7.7rem] h-0 border-transparent py-0'
                }`}
            >
                {props.links &&
                    props.links.map(folder => {
                        return (
                            <li key={folder.id}>
                                <button
                                    onClick={() => router.push(`/images/folder?id=${folder.id}${router.query.panel ? `&panel=${router.query.panel}` : ''}`)}
                                    className='flex w-full items-center justify-start rounded-md px-2 duration-500 hover:bg-gray-200'
                                >
                                    <div className='flex items-center'>
                                        <MdFolder className='text-xl' />
                                        <h2 className='w-full p-2'>{folder.name}</h2>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}
