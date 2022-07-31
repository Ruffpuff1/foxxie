import { SidebarContext } from '@hooks/useTodo';
import { minutes, seconds } from '@ruffpuff/utilities';
import { useContext, useEffect, useMemo, useState } from 'react';
import { MdClose } from 'react-icons/md';

export default function Pomo() {
    const { showPomo, setShowPomo } = useContext(SidebarContext);

    const [startTimestamp, setStartTimestamp] = useState(Date.now());
    const [paused, setPaused] = useState(false);

    const start = useMemo(() => new Date(1659283196653), []);
    const end = start.getTime() + minutes(22);

    const [ms, setMs] = useState(start.getTime() - end);

    useEffect(() => {
        const interval = setInterval(() => {
            if (paused) return;

            const now = Date.now();

            setMs(Math.floor(end - now));
        }, seconds(0.5));

        return () => {
            clearInterval(interval);
        };
    }, [ms, start, end, paused]);

    return (
        <div className={`fixed top-0 right-0 z-[4] h-full whitespace-nowrap bg-white pt-3 pr-0 shadow-lg duration-200 ease-in ${showPomo ? 'w-[288px]' : 'w-0'}`}>
            <div role='tabpanel' aria-label='Pomodoro'>
                <div className='flex items-center justify-between border-b border-b-gray-200 px-1 py-[2px]'>
                    <div className='ml-2 mb-2'>
                        <h2 className='pb-1 text-xs uppercase opacity-50'>Pomodoro</h2>
                    </div>
                    <button
                        aria-label='Close todo list'
                        className='rounded-full p-2 text-xl duration-500 hover:bg-gray-100'
                        onClick={() => {
                            setShowPomo(false);
                        }}
                    >
                        <MdClose />
                    </button>
                </div>
            </div>

            <div className={`mt-28 flex h-full flex-col items-center overflow-x-hidden whitespace-nowrap duration-200 ease-in ${showPomo ? ' w-[288px]' : 'w-0'}`}>
                <h1 className='mb-4 text-xl font-[500] tracking-wide text-red-500 duration-200 '>Working time!</h1>

                <h2 className='no-select text-3xl font-[500] tracking-wide md:text-5xl'>
                    {Math.floor(ms / 1000 / 60)
                        .toString()
                        .padStart(1, '0')}
                    :
                    {Math.floor((ms / 1000) % 60)
                        .toString()
                        .padStart(2, '0')}
                </h2>

                <div className='mt-5'>
                    <button
                        className='rounded-md bg-red-500 px-5 py-3 text-white shadow-md duration-200 hover:shadow-lg'
                        onClick={() => {
                            setPaused(!paused);
                        }}
                    >
                        Pause
                    </button>
                </div>
            </div>
        </div>
    );
}
