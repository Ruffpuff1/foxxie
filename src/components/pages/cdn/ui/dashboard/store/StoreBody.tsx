import { useAuth } from '@hooks/useAuth';
import { File, Folder, useFolder } from '@hooks/useFolder';
import Files from '../files/Files';
import Folders from '../folders/Folders';

export default function StoreBody(props: FolderData) {
    const [{ sharedFiles }] = useFolder(props.folder?.id, props.folder);
    const [user, { message }] = useAuth();

    if (!user && message === 'no-valid') {
        return (
            <div className='px-20 pb-10 pt-20'>
                <h1 className='text-2xl font-[450]'>Error :/</h1>
                <h2 className='text-xl font-[400]'>{parseMessage(message)}</h2>
            </div>
        );
    }

    return (
        <div className='pb-10 pt-20'>
            <div>
                {Boolean(props.childFolders?.length || props.sharedFolders?.length) && (
                    <Folders folders={[...(props.childFolders || []), ...(props.sharedFolders || [])].sort((a, b) => a.name.localeCompare(b.name))} />
                )}

                {Boolean(props.childFiles?.length || sharedFiles?.length) && (
                    <Files childFiles={[...(props.childFiles || []), ...(sharedFiles || [])].sort((a, b) => a.name.localeCompare(b.name))} folder={props.folder} />
                )}
            </div>
        </div>
    );
}

interface FolderData {
    folder: Folder | null;
    childFolders: Folder[];
    sharedFolders: Folder[];
    childFiles: File[];
}

function parseMessage(m: string) {
    switch (m) {
        case 'no-login':
            return 'You need to login to access this service!';
        case 'no-valid':
            return 'You are not an authorized user of this service!';
    }
}
