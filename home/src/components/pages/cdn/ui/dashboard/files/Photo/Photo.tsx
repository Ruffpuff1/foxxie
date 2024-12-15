import { File, Folder } from '@hooks/useFolder';
import { FileClickContext } from '@providers/FileClickProvider';
import { useDoubleClick, useQuery, useToggle } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useContext, useEffect } from 'react';
import { MdImage } from 'react-icons/md';

const PhotoPreview = dynamic(() => import('./PhotoPreview'));

export default function Photo({ photo, folder }: Props) {
    const [showPreview, { setTrue, setFalse }] = useToggle();
    const { setShowDetails, showDetails, setFile, file } = useContext(FileClickContext);
    const img = useQuery('img');

    useEffect(() => {
        if (img && img === photo.name) {
            setTrue();
        }
    }, [img, photo.name, setTrue]);

    const click = useDoubleClick(() => {
        if (showDetails) {
            setShowDetails(false);
        } else {
            setShowDetails(true);
            setFile(photo);
        }
    }, setTrue);

    const href = `${folder?.path ? `${folder.path.map(p => p.name).join('/')}/` : '/'}${folder?.name && folder.name !== 'Root' ? `${folder.name}/` : ''}${photo.name}`;
    const highlight = file?.name === photo.name && showDetails;

    return (
        <div>
            {showPreview && <PhotoPreview href={href} hide={setFalse} url={photo.url} />}

            <div role='row'>
                <button
                    aria-label={`Your ${photo.name} file`}
                    role='gridcell'
                    onClick={() => {
                        click();
                    }}
                    className={clsx('mb-2 ml-2 rounded-md border', {
                        'border-blue-200': highlight
                    })}
                >
                    <div className='overflow-hidden border-b bg-cover' style={{ backgroundImage: `url('${photo.url}')` }}>
                        <div className='h-40 w-40 md:h-60 md:w-60' />
                    </div>

                    <div className={clsx('flex items-center space-x-2 py-2 px-4 text-sm md:py-3', highlight ? 'bg-blue-100' : 'bg-white')}>
                        <MdImage className='text-2xl text-[#D93025]' />
                        <h2 className={clsx({ 'text-blue-500': highlight })}>{photo.name}</h2>
                    </div>
                </button>
            </div>
        </div>
    );
}

interface Props {
    photo: File;
    folder: Folder;
}
