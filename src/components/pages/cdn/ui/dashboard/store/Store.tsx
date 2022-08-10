import { useAuth } from '@hooks/useAuth';
import { useFolder } from '@hooks/useFolder';
import { SidebarContext } from '@hooks/useTodo';
import useId from '@providers/IdProvider';
import { toTitleCase } from '@ruffpuff/utilities';
import Meta from '@ui/Meta';
import { useContext } from 'react';
import StoreBody from './StoreBody';
import StoreHeader from './StoreHeader';

export default function Store() {
    const { showTodo } = useContext(SidebarContext);
    const [id] = useId();
    const [{ folder, childFolders, childFiles, sharedFolders }] = useFolder(id);
    const [user] = useAuth();

    return (
        <>
            <Meta
                title={`${folder?.name && folder.name !== 'Root' && user ? toTitleCase(folder.name) : 'My Files'} - Cdn`}
                description='Your files'
                icon='https://reese.cafe/images/icons/upload.png'
                noRobots
            />

            <div className={`duration-200 ease-in lg:ml-[15rem] ${showTodo ? 'lg:mr-0 lg:w-[60%]' : 'lg:mr-[3rem] lg:w-full'}`}>
                <StoreHeader folder={folder} />
                <StoreBody folder={folder} childFiles={childFiles} childFolders={childFolders} sharedFolders={sharedFolders} />
            </div>
        </>
    );
}
