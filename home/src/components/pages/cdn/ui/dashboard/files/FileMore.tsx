import { Folder } from '@hooks/useFolder';
import { FileClickContext } from '@providers/FileClickProvider';
import { FileModalContext } from '@providers/FileModalProvider';
import { useClickOutside, useToggle } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MdDriveFileRenameOutline, MdMoreVert, MdSaveAlt } from 'react-icons/md';

export default function FileMore({ currentFolder }: { currentFolder: Folder }) {
    const router = useRouter();

    const [showPanel, { setFalse, toggle }] = useToggle();
    const { file } = useContext(FileClickContext);
    const { setShowRename, showRename } = useContext(FileModalContext);
    useClickOutside(setFalse, 'cdn-file-more-list', [showPanel, !showRename]);

    const url = `/cdn/${currentFolder?.parentId ? `${currentFolder.path.map(p => p.name).join('/')}/` : ''}${currentFolder?.name}/${file.name}`;

    return (
        <>
            <li id='cdn-file-more-list'>
                <button onClick={toggle} className='rounded-full p-[4px] text-2xl text-[#767676] duration-200 hover:bg-gray-200 hover:text-black'>
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
