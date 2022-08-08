import { useContext, useState } from 'react';
import { Folder } from '@hooks/useFolder';
import { MdDriveFileRenameOutline, MdMoreVert, MdSaveAlt } from 'react-icons/md';
import { useClickOutside } from '@ruffpuff/usehooks';
import { FileModalContext } from '@providers/FileModalProvider';
import { FileClickContext } from '@providers/FileClickProvider';
import { useRouter } from 'next/router';
import clsx from 'clsx';

export default function FileMore({ currentFolder }: { currentFolder: Folder }) {
    const router = useRouter();

    const [showPanel, setShowPanel] = useState(false);
    const { file } = useContext(FileClickContext);
    const { setShowRename, showRename } = useContext(FileModalContext);

    const [liRef] = useClickOutside<HTMLLIElement>(() => {
        setShowPanel(false);
    }, [showPanel, !showRename]);

    const url = `/cdn/${currentFolder?.parentId ? `${currentFolder.path.map(p => p.name).join('/')}/` : ''}${currentFolder?.name}/${file.name}`;

    return (
        <>
            <li ref={liRef}>
                <button
                    onClick={() => {
                        setShowPanel(!showPanel);
                    }}
                    className='rounded-full p-[4px] text-2xl text-[#767676] duration-200 hover:bg-gray-200 hover:text-black'
                >
                    <MdMoreVert />
                </button>

                <div
                    className={clsx(
                        'fixed top-11 right-6 w-80 rounded-md border bg-white py-2 shadow-lg duration-200 ease-in',
                        showPanel ? 'h-96 opacity-100' : 'h-0 opacity-0'
                    )}
                >
                    <div className='w-full border-b'>
                        <button
                            onClick={() => {
                                setShowRename(true);
                            }}
                            className='flex w-full items-center space-x-4 py-2 pl-6 hover:bg-gray-200'
                        >
                            <MdDriveFileRenameOutline className='text-2xl' />
                            <h2 className='tracking-wide'>Rename</h2>
                        </button>
                    </div>

                    <div className='w-full'>
                        <button onClick={() => router.push(url)} className='flex w-full items-center space-x-4 py-2 pl-6 hover:bg-gray-200'>
                            <MdSaveAlt className='text-2xl' />
                            <h2 className='tracking-wide'>Download</h2>
                        </button>
                    </div>
                </div>
            </li>
        </>
    );
}
