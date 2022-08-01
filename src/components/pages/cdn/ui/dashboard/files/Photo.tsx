import React, { useContext, useEffect, useState } from 'react';
import { MdImage, MdArrowBack, MdArrowDropUp } from 'react-icons/md';
import { File, Folder } from '@hooks/useFolder';
import { useRouter } from 'next/router';
import { useDoubleClick } from '@hooks/useDoubleClick';
import { FileClickContext } from '@providers/FileClickProvider';

export default function Photo({ photo, folder }: Props) {
    const [showPreview, setShowPreview] = useState(false);
    const { setShowDetails, showDetails, setFile, file } = useContext(FileClickContext);
    const router = useRouter();

    useEffect(() => {
        const img = router.query.img as string | undefined;

        if (img && img === photo.name) {
            setShowPreview(true);
        }
    }, [setShowPreview, photo, router]);

    const hidePreview = () => {
        setShowPreview(false);
    };

    const click = useDoubleClick(
        () => {
            if (showDetails) {
                setShowDetails(false);
            } else {
                setShowDetails(true);
                setFile(photo);
            }
        },
        () => {
            setShowPreview(true);
        }
    );

    const href = `${folder?.path ? `${folder.path.map(p => p.name).join('/')}/` : '/'}${folder?.name && folder.name !== 'Root' ? `${folder.name}/` : ''}${photo.name}`;

    console.log(href, folder.path);

    return (
        <div>
            {showPreview && (
                <div className='fixed top-0 left-0 z-[4] flex h-full w-full flex-col items-center bg-black bg-opacity-80 px-10 pt-5'>
                    <header className='items-centter flex w-full justify-between text-gray-200'>
                        <div>
                            <button
                                onClick={() => {
                                    hidePreview();
                                }}
                                className='overflow-hidden rounded-md bg-opacity-10 p-1 text-2xl duration-500 hover:bg-black'
                            >
                                <MdArrowBack />
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={() => router.push(href)}
                                className='flex items-center justify-center space-x-1 rounded-md bg-opacity-10 duration-500 hover:cursor-pointer hover:bg-black'
                            >
                                <h2>Open</h2>
                                <MdArrowDropUp className='mt-1 text-xl' />
                            </button>
                        </div>
                    </header>

                    <div className='h-full w-full pb-8'>
                        <div className='h-full w-full bg-contain bg-center bg-no-repeat' style={{ backgroundImage: `url('${photo.url}')` }} />
                    </div>
                </div>
            )}

            <div role='row'>
                <button
                    aria-label={`Your ${photo.name} file`}
                    role='gridcell'
                    onClick={() => {
                        click();
                    }}
                    className={`rounded-md border ${file?.name === photo.name && showDetails ? 'border-blue-200' : ''} mb-2 ml-2`}
                >
                    <div className='overflow-hidden border-b bg-cover' style={{ backgroundImage: `url('${photo.url}')` }}>
                        <div className='h-40 w-40 md:h-60 md:w-60' />
                    </div>

                    <div className={`${file?.name === photo.name && showDetails ? 'bg-blue-100' : 'bg-white'} flex items-center space-x-2 py-2 px-4 text-sm md:py-3`}>
                        <MdImage className='text-2xl text-[#D93025]' />
                        <h2 className={`${file?.name === photo.name && showDetails ? 'text-blue-500' : ''}`}>{photo.name}</h2>
                    </div>
                </button>
            </div>
        </div>
    );
}

interface Props {
    photo: File;
    folder: Folder;
}
