import { useContext } from 'react';
import { MdArrowRight } from 'react-icons/md';
import { SidebarContext } from '@hooks/useTodo';
import TodoToggle from '../toggles/TodoToggle';

export default function LargeTopIcons({ setOpen, open }: { open: boolean; setOpen: (b: boolean) => void }) {
    const { showTodo } = useContext(SidebarContext);

    return (
        <>
            <div
                className={`fixed top-16 right-0 flex h-[93vh] w-0 flex-col items-start justify-between overflow-x-hidden border bg-white opacity-0 duration-200 ease-in lg:py-3 lg:pl-1 lg:opacity-100 ${
                    open ? 'lg:w-[60px]' : 'w-0'
                } ${showTodo ? 'lg:w-[340px]' : ''}`}
            >
                <div role='tablist' className='flex flex-col items-center'>
                    <div className='border-b-200 mx-1 flex flex-col items-center space-y-1 border-b pb-2'>
                        <TodoToggle />

                        <div
                            className={`fixed top-[4.2rem] h-11 w-0 rounded-md bg-[#FFB74F] duration-200 ease-in lg:w-2 ${
                                showTodo ? 'right-[17.75rem] opacity-100' : 'right-0 opacity-0'
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
                    } ${showTodo ? 'hidden' : ''}`}
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
