import { useRouter } from 'next/router';
import { useContext } from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import { TodoContext } from 'src/hooks/useTodo';
import TodoToggle from '../toggles/TodoToggle';

export default function LargeTopIcons({ setOpen, open }: { open: boolean; setOpen: (b: boolean) => void }) {
    const router = useRouter();
    const { showTodo } = useContext(TodoContext);

    return (
        <>
            <div
                className={`fixed top-16 right-0 flex h-[93vh] w-0 flex-col items-center justify-between overflow-x-hidden border bg-white py-3 duration-200 ease-in ${
                    open ? 'lg:w-[60px]' : 'w-0'
                } ${showTodo ? 'right-[286px]' : ''}`}
            >
                <div role='tablist'>
                    <div className='border-b-200 mx-1 flex flex-col items-center space-y-1 border-b pb-2'>
                        <button
                            role='tab'
                            aria-labelledby='newtab-icon'
                            className='flex items-center justify-center rounded-full duration-500 hover:bg-gray-200'
                            onClick={() => router.push('https://reese.cafe/newtab')}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img id='newtab-icon' height={28} className='m-1' width={28} src='https://reese.cafe/images/icons/tabs.png' alt='Newtab' />
                        </button>

                        <TodoToggle />

                        <div
                            className={`fixed top-28 h-11 w-0 rounded-md bg-[#FFB74F] duration-200 ease-in lg:w-2 ${
                                showTodo ? 'right-[17.75rem] opacity-100' : 'right-0 opacity-0'
                            }`}
                        />
                    </div>
                </div>
            </div>

            <div className={`fixed bottom-3 flex flex-col items-center duration-200 ease-in ${open ? 'right-3' : 'right-0'}`}>
                <button
                    aria-label='Toggle side panel'
                    className={`flex h-7 w-7 items-center justify-center bg-white p-1 duration-500 hover:bg-gray-200 ${
                        open ? 'rounded-full shadow-lg md:shadow-none' : 'w-10 rounded-l-full shadow-lg md:shadow-none'
                    } ${showTodo ? 'hidden' : ''}`}
                    onClick={() => {
                        setOpen(!open);
                    }}
                >
                    <h2 className='text-xl'>
                        <IoMdArrowDropright className={open ? '' : 'rotate-180'} />
                    </h2>
                </button>
            </div>
        </>
    );
}
