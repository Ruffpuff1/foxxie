/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useClickOutside } from '@ruffpuff/usehooks';
import { database } from '@utils/firebase';
import { getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { TodoTask } from '@hooks/useTodo';
import TodoDatePicker from '../TodoDatePicker';
import TodoItemCheckbox from './TodoItemCheckbox/TodoItemCheckbox';
import { days, hours, minutes, months, years } from '@ruffpuff/utilities';

const formatDuration = (d: Date) => {
    const now = Date.now();
    const timestamp = d.getTime();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);

    if (diff < minutes(1)) {
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }

    if (diff < hours(1)) {
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    if (diff < days(1)) {
        const hours = Math.floor((diff / 1000 / 60 / 60) % 60);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    if (diff < days(7)) {
        const days = Math.floor((diff / 1000 / 60 / 60 / 24) % 60);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    if (diff < days(56)) {
        const weeks = Math.floor((diff / 1000 / 60 / 60 / 24 / 7) % 60);
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }

    if (diff < years(1)) {
        const months = Math.floor((diff / 1000 / 60 / 60 / 24 / 7 / 30) % 60);
        return `${months} month${months === 1 ? '' : 's'} ago`;
    }

    return diff;
};

export default function TodoItem({ todo, sortBy }: { todo: TodoTask; sortBy: string }) {
    const [editText, setEditText] = useState(false);
    const [name, setName] = useState(todo.text);
    const [hidden, setHidden] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const showDate = sortBy !== 'date';

    const [textareaRef] = useClickOutside<HTMLTextAreaElement>(() => {
        setEditText(false);
        return name === '' ? undefined : updateName();
    }, [editText]);

    const date = todo.completeBy.toDate();

    const formatDate = (d: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(d);
    };

    const updateName = async () => {
        const q = query(database.todos, where('text', '==', todo.text), where('userId', '==', todo.userId));

        return getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    text: name.trim()
                });
            }
        });
    };

    const updateText = (v: string) => {
        setName(v);
    };

    const lineLength = 27;
    const l = name.length > lineLength ? Math.floor(name.length / lineLength) + 1 : 1;

    const inPast = date.getTime() < Date.now() + 1000;

    return (
        <li key={todo.id} className='list-none'>
            <div
                className={`group flex max-h-[140px] min-h-[28px] items-center justify-start space-x-4 overflow-hidden bg-white px-3 py-2 delay-200 duration-200 hover:bg-gray-100 ${
                    hidden ? 'h-0' : `100%`
                }`}
            >
                <TodoItemCheckbox setHidden={setHidden} todo={todo} />

                <div className='flex w-full flex-col items-start justify-start'>
                    <textarea
                        onChange={e => {
                            updateText(e.target.value);
                        }}
                        onClick={() => {
                            setEditText(true);
                        }}
                        spellCheck='false'
                        ref={textareaRef}
                        defaultValue={todo.text}
                        maxLength={200}
                        style={{ height: `${l * 20}px` }}
                        className={`max-h-[80px] min-h-[18px] w-full max-w-[220px] resize-none flex-wrap break-words bg-white px-1 align-top text-base font-[400] leading-[20px] duration-200 focus:outline-none group-hover:bg-gray-100`}
                    />

                    <button
                        onClick={() => {
                            setShowDatePicker(true);
                        }}
                        className={`flex items-center justify-center overflow-y-hidden rounded-full bg-white px-[10px] text-[12px] font-[500] duration-200 hover:bg-gray-200 ${
                            inPast ? 'text-red-600' : 'text-[#5f6368]'
                        } ${showDate ? 'mt-2 h-[25px] border border-gray-200 py-[3px]' : 'mt-0 h-0 py-0'}`}
                    >
                        {inPast ? formatDuration(date) : formatDate(date)}
                    </button>
                </div>
            </div>

            <TodoDatePicker show={showDatePicker && showDate} date={date} setShow={setShowDatePicker} text={todo.text} />
        </li>
    );
}
