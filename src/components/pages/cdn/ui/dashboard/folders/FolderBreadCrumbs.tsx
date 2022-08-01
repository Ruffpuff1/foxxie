import { Folder, FolderPath, RootFolder } from '@hooks/useFolder';
import { useState } from 'react';
import { useRouter } from 'next/router';
import FolderDots from './FolderDots';
import SharedPeopleButton from './SharedPeopleButton';

export default function FolderBreadCrumbs({ currentFolder }: Props) {
    const path = [currentFolder === RootFolder ? null : { name: 'Root', id: '' }, ...(currentFolder?.path || [])].filter(a => a !== null) as FolderPath[];

    const router = useRouter();

    const first = path[0];
    const noFirst = path.slice(1);
    const display = noFirst.length >= 3 ? [noFirst[noFirst.length - 1]] : noFirst;
    const remaining = noFirst.length >= 3 ? noFirst.slice(0, -1) : null;

    return (
        <div className='ml-2 flex items-center justify-center space-x-3 lg:ml-4'>
            {first && (
                <div className='flex items-center justify-center space-x-1'>
                    <a
                        href='/cdn'
                        className={`rounded-md py-1 px-3 duration-500 ${
                            currentFolder?.name === first.name ? 'text-gray-400 hover:bg-gray-300' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        My Files
                    </a>
                    <h2>/</h2>
                </div>
            )}
            {remaining && remaining.length && <FolderDots links={remaining} currentFolder={currentFolder!} first={first} />}

            {display.map(folder => {
                return (
                    <div key={folder.id} className='flex items-center justify-center space-x-1'>
                        <button
                            onClick={() => router.push(`/cdn/folder?id=${folder.id}`, undefined, { shallow: true })}
                            className={`rounded-md py-1 px-3 duration-500 ${
                                currentFolder?.name === folder.name ? 'text-gray-400 hover:bg-gray-300' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {folder.name === 'Root' ? 'My Files' : folder.name}
                        </button>
                        <h2>/</h2>
                    </div>
                );
            })}

            {currentFolder && (
                <h2 className='flex max-w-[200px] items-center justify-center space-x-1 rounded-md py-1 px-3 duration-500'>
                    {currentFolder.name === 'Root' ? 'My Files' : currentFolder.name}
                </h2>
            )}

            <SharedPeopleButton currentFolder={currentFolder} />
        </div>
    );
}

interface Props {
    currentFolder: Folder | null;
}
