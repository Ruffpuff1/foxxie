import { useAuth } from '@hooks/useAuth';
import { File, Folder, useFolder } from '@hooks/useFolder';
import Link from '@ui/Link/Link';
import { MdInfo } from 'react-icons/md';
import Files from '../files/Files';
import Folders from '../folders/Folders';

export default function StoreBody(props: FolderData) {
    const [{ sharedFiles }] = useFolder(props.folder?.id, props.folder);
    const [, { message }] = useAuth();

    if (message === 'no-valid') {
        return (
            <div className='mx-20 p-2 flex w-[80%] shadow-sm items-center space-x-2 mb-10 mt-20 bg-white border'>
                <MdInfo className='text-2xl text-blue-500' />
                <div className='text-base font-normal flex items-center space-x-2'>
                    <h2>Your current account can&apos;t use Cdn. To continue, switch to an account with Cdn privileges.</h2>
                    <Link blue popup href='/support/cdn'>Learn More</Link>
                </div>
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
