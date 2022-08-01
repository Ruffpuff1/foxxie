import { FileClickContext } from '@providers/FileClickProvider';
import { FileModalContext } from '@providers/FileModalProvider';
import { database } from '@utils/firebase';
import { getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState, useContext } from 'react';
import Modal from '../Modal';

export default function RenameModal() {
    const { showRename, setShowRename } = useContext(FileModalContext);
    const { file, setShowDetails } = useContext(FileClickContext);

    const def = file?.name || '';
    const [name, setName] = useState(def);

    const submit = async () => {
        setShowRename(false);
        setShowDetails(false);

        const q = query(database.files, where('name', '==', file.name), where('userId', '==', file.userId), where('folderId', '==', file.folderId));

        return getDocs(q).then(async files => {
            const file = files.docs[0];

            if (file) {
                await updateDoc(file.ref, {
                    name
                });
            }
        });
    };

    return (
        <Modal open={showRename}>
            <Modal.Header>Rename</Modal.Header>
            <Modal.Body>
                <input
                    onChange={e => {
                        setName(e.target.value);
                    }}
                    type='text'
                    className='w-72 rounded-sm border border-gray-300 bg-transparent px-1 py-[2px] drop-shadow-lg'
                    defaultValue={def}
                />
            </Modal.Body>
            <Modal.Footer>
                <Modal.Button
                    onClick={() => {
                        setShowRename(false);
                    }}
                    className='uppercase tracking-wide text-black'
                >
                    Cancel
                </Modal.Button>
                <Modal.Button onClick={() => submit()} className='text-text bg-blue-500 uppercase tracking-wide'>
                    Ok
                </Modal.Button>
            </Modal.Footer>
        </Modal>
    );
}
