import useId from '@providers/IdProvider';
import StoreHeader from './StoreHeader';
import { toTitleCase } from '@ruffpuff/utilities';
import { NextSeo } from 'next-seo';
import { useFolder } from '@hooks/useFolder';
import StoreBody from './StoreBody';
import { useAuth } from '@hooks/useAuth';

export default function Store({ showTodo }: { showTodo: boolean }) {
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
