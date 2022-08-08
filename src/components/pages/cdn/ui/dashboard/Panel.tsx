import { useAuth } from '@hooks/useAuth';
import { RootFolder, useFolder } from '@hooks/useFolder';
import useId from '@providers/IdProvider';
import { useClickOutside } from '@ruffpuff/usehooks';
import clsx from 'clsx';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import AddFileButton from './buttons/AddFileButton/AddFileButton';
import AddFolderButton from './buttons/AddFolderButton';

export default function Panel() {
    const [isOpen, setIsOpen] = useState(false);

    const [user] = useAuth();
    const [id] = useId();

    const [{ folder }] = useFolder(id);

    const owned = user?.uid === folder?.userId;

    const [divRef] = useClickOutside<HTMLDivElement>(() => {
        setIsOpen(false);
    });

    return (
        <>
            <div className='fixed top-16 left-0 z-[1] hidden h-[92vh] justify-start border-r border-t bg-white lg:flex lg:w-60'>
                {user && (
                    <div className='ml-5 mt-5'>
                        <button
                            aria-labelledby='new-label'
                            className='rounded-full border border-gray-200 px-7 py-3 shadow-md duration-200 hover:shadow-lg'
                            onClick={() => {
                                setIsOpen(!isOpen);
                            }}
                        >
                            <h2 className='flex items-center justify-between space-x-1'>
                                <MdAdd className='text-4xl font-semibold text-blue-500 duration-500 hover:text-black' />
                                <span id='new-label'>New</span>
                            </h2>
                        </button>
                    </div>
                )}
            </div>

            <div
                ref={divRef}
                className={clsx(
                    'fixed top-[5rem] left-3 w-72 rounded-md border-2 border-gray-100 border-opacity-50 bg-white py-3 shadow-lg duration-200 ease-in-out',
                    isOpen ? 'z-[1] opacity-100' : 'z-[-4] opacity-0'
                )}
            >
                {Boolean(owned || folder === RootFolder) && (
                    <ul
                        id='new-list'
                        className={clsx({
                            'rounded-none border-b border-b-gray-200 pb-1': folder !== RootFolder
                        })}
                    >
                        <li className='w-full rounded-md duration-200 hover:bg-gray-200'>
                            <AddFolderButton currentFolder={folder} />
                        </li>
                        <li className='w-full rounded-md duration-200 hover:bg-gray-200'>
                            <AddFileButton currentFolder={folder} />
                        </li>
                    </ul>
                )}
            </div>
        </>
    );
}
