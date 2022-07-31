import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MdArrowRight } from 'react-icons/md';
import { SidebarContext } from '@hooks/useTodo';
import TodoToggle from '../toggles/TodoToggle';
import PomodoroToggle from '../toggles/PomodoroToggle';

export default function LargeTopIcons({ setOpen, open }: { open: boolean; setOpen: (b: boolean) => void }) {
    const router = useRouter();
    const { showTodo, showPomo } = useContext(SidebarContext);

    return (
        <>
            <div
                className={`fixed top-16 right-0 flex h-[93vh] w-0 flex-col items-start justify-between overflow-x-hidden border bg-white py-3 pl-1 duration-200 ease-in ${
                    open ? 'lg:w-[60px]' : 'w-0'
                } ${showTodo || showPomo ? 'lg:w-[340px]' : ''}`}
            >
                <div role='tablist' className='flex flex-col items-center'>
                    <div className='border-b-200 mx-1 flex flex-col items-center space-y-1 border-b pb-2'>
                        <TodoToggle />
                        <PomodoroToggle />

                        <div
                            className={`fixed top-[4.2rem] h-11 w-0 rounded-md bg-[#FFB74F] duration-200 ease-in lg:w-2 ${
                                showTodo ? 'right-[17.75rem] opacity-100' : 'right-0 opacity-0'
                            }`}
                        />

                        <div
                            className={`fixed top-[7.1rem] h-11 w-0 rounded-md bg-[#F43B3B] duration-200 ease-in lg:w-2 ${
                                showPomo ? 'right-[17.75rem] opacity-100' : 'right-0 opacity-0'
                            }`}
                        />
                    </div>
                </div>
            </div>

            <div className={`fixed bottom-3 z-[2] flex flex-col items-center duration-200 ease-in ${open ? 'right-3' : 'right-0'}`}>
                <button
                    aria-label='Toggle side panel'
                    className={`flex h-7 w-7 items-center justify-center bg-white p-1 duration-500 hover:bg-gray-200 ${
                        open ? 'rounded-full shadow-lg md:shadow-none' : 'w-10 rounded-l-full shadow-lg md:shadow-none'
                    } ${showTodo || showPomo ? 'hidden' : ''}`}
                    onClick={() => {
                        setOpen(!open);
                    }}
                >
                    <h2 className='text-xl'>
                        <MdArrowRight className={open ? '' : 'rotate-180'} />
                    </h2>
                </button>
            </div>
        </>
    );
}
