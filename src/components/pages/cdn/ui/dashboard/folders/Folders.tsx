import { Folder as FolderType } from 'src/hooks/useFolder';
import Folder from './Folder';
import SharedFolder from './SharedFolder';

export default function Folders({ folders }: { folders: FolderType[] }) {
    return (
        <div role='region' aria-label='Your folders'>
            <h2 className='ml-5 text-sm'>Folders</h2>

            <div role='grid' className='ml-5 flex flex-wrap items-center space-x-2'>
                {folders.map(childFolder => {
                    return (
                        <div role='row' key={childFolder.id} className='ml-2 max-w-[275px] p-2 pl-0'>
                            {childFolder.sharedUsers?.length ? <SharedFolder folder={childFolder} /> : <Folder folder={childFolder} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
