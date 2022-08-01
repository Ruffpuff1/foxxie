import StoreHeader from './StoreHeader';
import StoreBody from './StoreBody';
import useId from '@providers/IdProvider';
import { useContext } from 'react';
import { NextSeo } from 'next-seo';
import { toTitleCase } from '@ruffpuff/utilities';
import { useFolder } from '@hooks/useFolder';
import { useAuth } from '@hooks/useAuth';
import { SidebarContext } from '@hooks/useTodo';

export default function Store() {
    const { showTodo } = useContext(SidebarContext);

    const [id] = useId();
    const [{ folder, childFolders, childFiles, sharedFolders }] = useFolder(id);
    const [user] = useAuth();

    return (
        <div className={`duration-200 ease-in lg:ml-[15rem] ${showTodo ? 'lg:mr-0 lg:w-[60%]' : 'lg:mr-[3rem] lg:w-full'}`}>
            <NextSeo title={`${folder?.name && folder.name !== 'Root' && user ? toTitleCase(folder.name) : 'My Files'} - Cdn`} />

            <StoreHeader folder={folder} />
            <StoreBody folder={folder} childFiles={childFiles} childFolders={childFolders} sharedFolders={sharedFolders} />
        </div>
    );
}
