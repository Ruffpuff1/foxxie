import { database } from '@utils/firebase';
import { getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { AuthContext } from '@hooks/useAuth';
import { useClickOutside } from '@ruffpuff/usehooks';

export default function TodoDatePicker({ show, date: d, setShow, text }: { text: string; show: boolean; date: Date | null; setShow: (b: boolean) => void; }) {
    const router = useRouter();
    const [date, setDate] = useState(d);
    const [showDateInput, setShowDateInput] = useState(false);
    const [numDay, setDay] = useState(date?.getDate() || new Date().getDate());
    const user = useContext(AuthContext);

    const toDate = (d: Date | null, options?: Intl.DateTimeFormatOptions) => {
        if (d === null) return '';
        return new Intl.DateTimeFormat('en-US', options).format(d);
    };

    const month = toDate(date, { month: 'long' });
    const year = toDate(date, { year: 'numeric' });
    const day = toDate(date, { day: 'numeric', weekday: 'short' });

    const [inputRef] = useClickOutside<HTMLInputElement>(() => {
        setShowDateInput(false);

        const dd = date ? new Date(date) : new Date();
        dd.setDate(numDay);
        setDate(dd);
    }, [showDateInput]);

    const reset = () => {
        setDate(d);
        setDay(d?.getDate() || new Date().getDate());
    };

    const setTaskDate = async () => {
        const q = query(database.todos, where('text', '==', text), where('userId', '==', user?.uid || null));

        await getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    completeBy: date ? Timestamp.fromDate(date) : null
                });
            }
        });

        setShow(false);
        reset();
    };

    return (
        <div className={`duration fixed top-0 right-0 z-[5] flex h-full w-72 items-start justify-center bg-black bg-opacity-20 pt-16 ${show ? '' : 'hidden'}`}>
            <div className='h-[25rem] w-[16.5rem] rounded-md bg-white shadow-md'>
                <div className='flex items-center justify-between px-4 pt-4'>
                    <button
                        onClick={() => {
                            const monthNum = date?.getMonth() || new Date().getMonth();
                            const dt = date ? new Date(date) : new Date();

                            if (monthNum === 0) {
                                dt.setFullYear(date ? (date.getFullYear() - 1) : new Date().getFullYear() - 1);
                            }

                            dt.setMonth(monthNum === 0 ? 11 : monthNum - 1);
                            setDate(dt);
                        }}
                    >
                        <h2 className='text-xl'>
                            <MdKeyboardArrowLeft />
                        </h2>
                    </button>
                    <h2 className='text-sm font-[500]'>
                        {month} {year}
                    </h2>
                    <button
                        onClick={() => {
                            const monthNum = date ? date.getMonth() : new Date().getMonth();
                            const dt = date ? new Date(date) : new Date();

                            if (monthNum === 11) {
                                dt.setFullYear(date ? date.getFullYear() + 1 : new Date().getFullYear());
                            }

                            dt.setMonth(monthNum === 11 ? 0 : monthNum + 1);
                            setDate(dt);
                        }}
                    >
                        <h2 className='text-xl'>
                            <MdKeyboardArrowRight />
                        </h2>
                    </button>
                </div>

                <div className='pt-5'>
                    <div className='flex items-center justify-between px-4'>
                        <h2 className='text-sm font-[500]'>Day</h2>

                        <button
                            className={`rounded-md py-1 px-2 duration-500 hover:bg-gray-200 ${showDateInput ? 'hidden' : ''}`}
                            onClick={() => {
                                setShowDateInput(true);
                            }}
                        >
                            <h3 className='text-sm font-[500]'>{day}</h3>
                        </button>
                        <button className={`${showDateInput ? '' : 'hidden'}`}>
                            <input
                                ref={inputRef}
                                type='number'
                                onChange={e => {
                                    setDay(parseInt(e.target.value, 10));
                                }}
                                className='w-20 text-sm font-[500]'
                                min={1}
                                max={getMax(date ? date.getMonth() : new Date().getMonth())}
                                value={numDay}
                            />
                        </button>
                    </div>
                </div>

                <div className='mt-20 border-t border-t-gray-200'>
                    <div className='flex items-center justify-between px-4 pt-2'>
                        <button className='rounded-full p-1 duration-500 hover:bg-gray-200'>
                            <h3 className='text-sm font-[500]'>
                                <HiOutlineTrash />
                            </h3>
                        </button>
                        <div className='flex items-center justify-center space-x-5'>
                            <button
                                onClick={() => {
                                    setShow(false);
                                    reset();
                                }}
                                className='rounded-md py-1 px-2 duration-500 hover:bg-gray-200'
                            >
                                <h3 className='text-sm font-[500]'>Cancel</h3>
                            </button>
                            <button onClick={() => setTaskDate()} className='rounded-md py-1 px-2 duration-500 hover:bg-gray-200'>
                                <h3 className='text-sm font-[500] text-blue-500'>Done</h3>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getMax(m: number) {
    switch (m) {
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31;
        case 1: {
            const y = new Date().getFullYear();
            const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
            return isLeap ? 29 : 28;
        }
        default:
            return 30;
    }
}
