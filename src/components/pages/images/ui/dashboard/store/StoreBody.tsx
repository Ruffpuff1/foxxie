import { useAuth } from '@hooks/useAuth';
import { File, Folder, useFolder } from '@hooks/useFolder';
import Files from '../files/Files';
import Folders from '../folders/Folders';

export default function StoreBody(props: FolderData) {
    const [{ sharedFiles }] = useFolder(props.folder?.id, props.folder);
    const [user] = useAuth();

    if (!user) return null;

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
