import { useContext } from 'react';
import { SidebarContext } from '@hooks/useTodo';

export default function PomodoroToggle() {
    const { setShowPomo, showPomo } = useContext(SidebarContext);

    return (
        <button
            role='tab'
            aria-selected={showPomo}
            aria-labelledby='todo-icon'
            className='flex items-center justify-center rounded-full duration-200 hover:bg-gray-200'
            onClick={() => {
                setShowPomo(!showPomo);
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id='pomodoro-icon' height={28} className='m-1' width={28} src='https://reese.cafe/images/icons/tomato.png' alt='Pomodoro' />
        </button>
    );
}
