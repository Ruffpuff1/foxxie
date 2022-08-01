import { TodoTask } from '@hooks/useTodo';
import { database } from '@utils/firebase';
import { getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import styles from './TodoItemCheckbox.module.css';

export default function TodoItemCheckbox({ setHidden, todo }: { setHidden: (value: boolean) => void; todo: TodoTask }) {
    const [complete, setComplete] = useState(false);
    const [hover, setHover] = useState(false);

    const completeTask = async () => {
        setComplete(true);

        const q = query(database.todos, where('text', '==', todo.text), where('userId', '==', todo.userId));

        await getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    completed: true
                });
            }
        });

        setHidden(true);
    };

    return (
        <>
            <div
                role='button'
                tabIndex={-1}
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}
                className={styles.button_wrapper}
            >
                <button className={styles.button} onClick={() => completeTask()}>
                    <MdCheck className={`${styles.check} ${hover ? styles.check_show : styles.check_hide}`} />
                </button>
            </div>

            <div className={`${styles.tooltip} ${hover ? styles.tooltip_show : styles.tooltip_hide}`}>Mark completed</div>
        </>
    );
}
