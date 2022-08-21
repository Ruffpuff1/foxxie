import { database, storage } from '@util/firebase';
import { deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { useContext } from 'react';
import { ref, deleteObject } from 'firebase/storage';
import { FileClickContext } from '@providers/FileClickProvider';
import { MdDeleteOutline } from 'react-icons/md';

export default function FileDelete() {
    const { file, setFile, setShowDetails } = useContext(FileClickContext);

    const deleteFile = async () => {
        const q = query(database.files, where('folderId', '==', file.folderId || null), where('name', '==', file.name), where('userId', '==', file.userId));

        return getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await deleteDoc(existingFile.ref);
                const docRef = ref(storage, `/files/${file!.userId}/${existingFile.id}`);

                await deleteObject(docRef);
                setShowDetails(false);
                setFile(null!);
            }
        });
    };

    return (
        <li>
            <button onClick={deleteFile} className='rounded-full p-[4px] text-2xl text-[#767676] duration-200 hover:bg-gray-200 hover:text-black'>
                <MdDeleteOutline />
            </button>
        </li>
    );
}
