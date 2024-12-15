import { useAuth } from '@hooks/useAuth';
import { Folder } from '@hooks/useFolder';
import Tooltip from '@mui/material/Tooltip';
import { useToggle } from '@reeseharlak/usehooks';
import { database, storage } from '@util/firebase';
import { addDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import Modal from '../../Modal';
import styles from './AddFileButton.module.css';

export default function AddFileButton({ currentFolder }: { currentFolder: null | Folder }) {
    const [open, { setFalse, setTrue }] = useToggle(false);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [user] = useAuth();

    async function handleSubmit() {
        if (file === null || currentFolder === null) return;
        const fileName = (name || file.name).replace(/ /g, '-');

        const uploadedFileRef = await addDoc(database.files, {
            url: null,
            name: fileName,
            createdAt: database.getTimestamp(),
            folderId: currentFolder.id,
            userId: user!.uid
        });

        const uploadRef = ref(storage, `/files/${user!.uid}/${uploadedFileRef.id}`);
        const uploadTask = uploadBytesResumable(uploadRef, file);

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            },
            () => {
                /* */
            },
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then(async url => {
                    const q = query(database.files, where('name', '==', fileName), where('userId', '==', user!.uid), where('folderId', '==', currentFolder.id));

                    await getDocs(q).then(async existingFiles => {
                        const existingFile = existingFiles.docs[0];
                        if (existingFile) {
                            await updateDoc(existingFile.ref, { url });
                        }
                    });
                });
            }
        );

        setFalse();
        setFile(null);
        setName('');
    }

    function handleFile(file: File | null) {
        if (file === null || currentFolder === null) return;
        if (name === '') setName(file.name);
        setFile(file);
    }

    function handleClose() {
        setFile(null);
        setFalse();
        setName('');
    }

    return (
        <div className={styles.wrapper}>
            <Tooltip id='file-upload-tooltip' title='Upload a new file'>
                <button aria-labelledby='file-upload-tooltip' className={styles.button} onClick={setTrue}>
                    <MdOutlineFileUpload aria-hidden className={styles.folder_icon} />
                    <span aria-hidden className={styles.button_text}>
                        File upload
                    </span>
                </button>
            </Tooltip>
            <Modal open={open}>
                <Modal.Header>Upload file</Modal.Header>
                <Modal.Body>
                    <input
                        className={styles.add_file_name_input}
                        type='text'
                        value={name}
                        onChange={e => {
                            setName(e.target.value.replace(/ /g, '-'));
                        }}
                    />
                    <input
                        type='file'
                        onChange={e => {
                            handleFile(e.target.files?.[0] || null);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Button
                        className={styles.close_button}
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        Close
                    </Modal.Button>
                    <Modal.Button className={styles.upload_button} onClick={() => handleSubmit()}>
                        Upload
                    </Modal.Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
