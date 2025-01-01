import { File, Folder } from 'src/hooks/useFolder';
import Pdf from './Pdf';
import Photo from './Photo/Photo';

export default function Files({ childFiles, folder }: { childFiles: File[]; folder: Folder | null }) {
    return (
        <div role='region' aria-label='Your files'>
            <h2 className='ml-5 text-sm'>Files</h2>

            <div role='grid' className='ml-5 mt-5 flex flex-wrap items-center justify-start'>
                {childFiles.map(childFile => {
                    const ext = childFile.name.split('.')[1];

                    if (ext === 'pdf') {
                        return <Pdf file={childFile} folder={folder} />;
                    }

                    if (['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(ext)) {
                        return <Photo key={childFile.id} photo={childFile} folder={folder!} />;
                    }

                    return (
                        <div key={childFile.id} className='mb-2 ml-2 max-w-[250px] p-2'>
                            {childFile.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
