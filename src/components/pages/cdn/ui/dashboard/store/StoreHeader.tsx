import { useAuth } from '@hooks/useAuth';
import { Folder } from '@hooks/useFolder';
import { SidebarContext } from '@hooks/useTodo';
import { FileClickContext } from '@providers/FileClickProvider';
import { useContext } from 'react';
import FileDelete from '../files/FileDelete';
import FileMore from '../files/FileMore';
import FolderBreadCrumbs from '../folders/FolderBreadCrumbs';

export default function StoreHeader({ folder }: { folder: Folder | null }) {
    const { showDetails, file } = useContext(FileClickContext);
    const { showTodo } = useContext(SidebarContext);
    const [user] = useAuth();

    return (
        <header className='fixed top-16 right-0 z-[0.4] mx-1 flex w-full items-center justify-between border-y border-y-gray-200 bg-white py-[10px] lg:w-[calc(100%-240px)]'>
            {user && <FolderBreadCrumbs currentFolder={folder} />}

            {showDetails && (
                <div className={`delay-200 duration-200 lg:delay-[0ms] ${showTodo ? 'translate-x-[14rem] lg:mr-96 lg:translate-x-[2rem]' : 'translate-x-0 lg:mr-16'}`}>
                    <ul className='flex items-center justify-center space-x-2 text-[#767676] lg:space-x-3'>
                        <li>
                            <h2>{file.name}</h2>
                        </li>
                        <FileDelete />
                        <FileMore currentFolder={folder!} />
                    </ul>
                </div>
            )}
        </header>
    );
}
