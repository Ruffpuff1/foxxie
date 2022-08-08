import { useDoubleClick } from '@hooks/useDoubleClick';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MdPictureAsPdf } from 'react-icons/md';
import { FileClickContext } from '@providers/FileClickProvider';
import { File, Folder } from 'src/hooks/useFolder';
import clsx from 'clsx';

export default function Pdf({ file, folder }: { file: File; folder: Folder | null }) {
    const path = `/${folder?.path ? `${folder.path.map(p => p.name).join('/')}/` : ''}${folder?.name && folder.name !== 'Root' ? `${folder.name}/` : ''}${file.name}`;

    const { setShowDetails, showDetails, setFile, file: item } = useContext(FileClickContext);
    const router = useRouter();

    const highlight = item?.name === file.name && showDetails;

    const click = useDoubleClick(
        () => {
            if (showDetails) {
                setShowDetails(false);
            } else {
                setShowDetails(true);
                setFile(file);
            }
        },
        () => router.push(path)
    );

    return (
        <button
            aria-label={`Your ${file.name} file`}
            role='gridcell'
            onClick={click}
            className={clsx('mb-2 ml-2 rounded-md border', {
                'border-blue-200': highlight
            })}
        >
            <div
                className='overflow-hidden border-b bg-cover'
                style={{
                    backgroundImage: `url('${file.url}')`
                }}
            >
                <div className='h-40 w-40 rounded-md md:h-60 md:w-60' />
            </div>

            <div className={clsx('flex items-center space-x-2 py-2 px-4 text-sm', highlight ? 'bg-blue-100' : 'bg-white')}>
                <MdPictureAsPdf className='text-2xl text-[#EA4336]' />
                <h2 className={clsx({ 'text-blue-500': highlight })}>{file.name}</h2>
            </div>
        </button>
    );
}
