import { useState } from 'react';
import { addDoc } from 'firebase/firestore';
import { database, auth } from '@utils/firebase';
import { Folder, RootFolder } from '@hooks/useFolder';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import Modal from '../Modal';
import { Tooltip } from '@mui/material';

export default function AddFolderButton({ currentFolder }: { currentFolder: null | Folder }) {
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);

    async function handleSubmit() {
        if (currentFolder === null) return;

        const path = [...currentFolder?.path];

        if (currentFolder !== RootFolder) {
            path.push({ name: currentFolder.name, id: currentFolder.id });
        }

        await addDoc(database.folders, {
            name: name.replace(/ /g, '-'),
            parentId: currentFolder.id,
            userId: auth.currentUser?.uid,
            path,
            color: null,
            createdAt: database.getTimestamp()
        });

        setName('');
        setOpen(false);
    }

    function handleClose() {
        setName('');
        setOpen(false);
    }

    return (
        <div className='w-full py-2 px-4'>
            <Tooltip id='create-folder-tooltip' title='Create a new folder'>
                <button
                    aria-labelledby='create-folder-tooltip'
                    className='flex w-full items-center justify-start space-x-2'
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <MdOutlineCreateNewFolder aria-hidden className='text-3xl font-[400]' />
                    <h2 aria-hidden className='text-base font-[450] tracking-wide'>
                        Folder
                    </h2>
                </button>
            </Tooltip>
            <Modal open={open}>
                <Modal.Header>Folder Name</Modal.Header>
                <Modal.Body>
                    <input
                        className='w-full rounded-md border-2 bg-transparent p-2'
                        type='text'
                        value={name}
                        onChange={e => {
                            setName(e.target.value.replace(/ /g, '-'));
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Button
                        className='bg-[#818181]'
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        Close
                    </Modal.Button>
                    <Modal.Button className='bg-[#24853D] hover:border-[#2b9d48]' onClick={() => handleSubmit()}>
                        Add folder
                    </Modal.Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
