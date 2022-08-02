import { database, storage } from '@utils/firebase';
import { query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useContext, useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import { AuthContext } from '@hooks/useAuth';
import { Folder } from '@hooks/useFolder';
import Modal from '../../Modal';
import styles from './AddFileButton.module.css';

export default function AddFileButton({ currentFolder }: { currentFolder: null | Folder }) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const user = useContext(AuthContext);

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

        setOpen(false);
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
        setOpen(false);
        setName('');
    }

    function handleOpen() {
        setOpen(true);
    }

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.button}
                onClick={() => {
                    handleOpen();
                }}
            >
                <MdOutlineFileUpload className={styles.folder_icon} />
                <span className={styles.button_text}>File upload</span>
            </button>
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
