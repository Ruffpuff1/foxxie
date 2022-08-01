/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useClickOutside } from '@ruffpuff/usehooks';
import { database } from '@utils/firebase';
import { getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { TodoTask } from '@hooks/useTodo';
import TodoDatePicker from '../TodoDatePicker';
import TodoItemCheckbox from './TodoItemCheckbox/TodoItemCheckbox';
import { days, hours, minutes, years } from '@ruffpuff/utilities';
import { MdNotes } from 'react-icons/md';

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

export default function TodoItem({ todo, sortBy }: { todo: TodoTask; sortBy: string; }) {
    const [editText, setEditText] = useState(false);
    const [name, setName] = useState(todo.text);
    const [hidden, setHidden] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [open, setOpen] = useState(false);

    const [details, setDetails] = useState(todo.details || '');
    const [editDetails, setEditDetails] = useState(false);

    const showDate = sortBy !== 'date' && !open;

    const [textareaRef] = useClickOutside<HTMLTextAreaElement>(() => {
        setEditText(false);
        return name === '' ? undefined : updateName();
    }, [editText]);

    const [textarea2Ref] = useClickOutside<HTMLTextAreaElement>(() => {
        setEditDetails(false);
        return updateDetails();
    }, [editDetails]);

    const [liRef] = useClickOutside<HTMLLIElement>(() => {
        setOpen(false);
        if (editDetails) setEditDetails(false);
    }, [open]);

    const date = todo.completeBy?.toDate() || null;

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

    const updateDetails = async () => {
        const q = query(database.todos, where('text', '==', todo.text), where('userId', '==', todo.userId));

        return getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    details: details.trim() || null
                });
            }
        });
    };

    const updateText = (v: string) => {
        setName(v);
    };

    const lineLength = 27;
    const l = name.length > lineLength ? Math.floor(name.length / lineLength) + 1 : 1;

    const detailsLineLength = 17;
    const dl = details.length > detailsLineLength ? Math.floor(details.length / detailsLineLength) + 1 : 1;

    const inPast = date ? date.getTime() < Date.now() + 1000 : false;

    return (
        <li ref={liRef} key={todo.id} className='list-none'>
            <button
                onClick={() => {
                    setOpen(true);
                }}
                className={`group flex justify-start space-x-4 overflow-hidden bg-white px-3 py-2 delay-200 duration-200 hover:bg-gray-100 ${hidden ? 'h-0' : `100%`
                    } ${open ? ' max-h-[250px] min-h-[88px] items-start' : 'max-h-[140px] min-h-[28px] items-center'}`}
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
                        className={`max-h-[80px] min-h-[18px] w-full max-w-[200px] resize-none flex-wrap break-words bg-transparent px-1 align-top text-base font-[400] leading-[20px] duration-200 focus:outline-none`}
                    />

                    {
                        todo.completeBy &&
                        <button
                            onClick={() => {
                                setShowDatePicker(true);
                            }}
                            className={`flex items-center justify-center overflow-y-hidden rounded-full bg-white px-[10px] text-[12px] font-[500] duration-200 hover:bg-gray-200 ${inPast ? 'text-red-600' : 'text-[#5f6368]'
                                } ${showDate ? 'mt-2 h-[25px] border border-gray-200 py-[3px]' : 'mt-0 h-0 py-0'}`}
                        >
                            {inPast ? formatDuration(date!) : formatDate(date!)}
                        </button>
                    }

                    <div className={`duration-200 flex flex-col items-center justify-start delay-200 overflow-y-hidden ${open ? 'h-[60px]' : 'h-0'}`}>
                        <button
                            onClick={() => {
                                setEditDetails(true);
                            }}
                            className='text-[#5f6368] mt-1 flex items-start space-x-1'
                        >
                            <MdNotes className={`text-2xl duration-200 ${editDetails ? 'w-0' : 'w-8'}`} />
                            <textarea
                                name="details"
                                onChange={e => {
                                    setDetails(e.target.value);
                                }}
                                id="details-textarea"
                                cols={editDetails ? 20 : 25}
                                spellCheck='false'
                                ref={textarea2Ref}
                                defaultValue={todo.details || undefined}
                                placeholder='Details'
                                style={{ height: `${dl * 13}px` }}
                                className={`text-[13px] mt-1 resize-none px-1 max-h-[65px] focus:outline-none min-h-[24px] py-[2px] leading-[10px] align-top break-words bg-transparent font-[400] duration-200 ${editDetails ? 'w-[180px]' : 'w-[148px]'}`}
                            />
                        </button>
                    </div>
                </div>
            </button>

            <TodoDatePicker show={showDatePicker && showDate} date={date} setShow={setShowDatePicker} text={todo.text} />
        </li>
    );
}
