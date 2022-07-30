import { useClickOutside } from '@ruffpuff/usehooks';
import { toTitleCase } from '@ruffpuff/utilities';
import { sleep } from '@utils/constants';
import { useState } from 'react';
import { MdAdd, MdCheck, MdKeyboardArrowDown } from 'react-icons/md';
import { TodoList } from 'src/hooks/useTodo';
import TaskListCreator from './TaskListCreator';

export default function TaskListSelector(props: { list: string; lists: TodoList[]; setList: (l: string) => void }) {
    const [showList, setShowList] = useState(false);
    const lists = props.lists.map(t => t.name);

    const [showPlus, setShowPlus] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [darkBg, setDarkBg] = useState(false);

    const [divRef] = useClickOutside<HTMLDivElement>(() => {
        setShowList(false);
    }, [showList]);

    const setUpCreate = async () => {
        setDarkBg(true);
        await sleep(500);
        setShowCreate(true);
        setDarkBg(false);
    };

    return (
        <div ref={divRef}>
            <button
                aria-label={`${showList ? 'Close' : 'Open'} your task lists current: ${props.list === 'tasks' ? 'Your Tasks' : toTitleCase(props.list)}`}
                className={`flex items-center justify-center space-x-1 rounded-md p-1 hover:bg-gray-200 ${showList ? 'bg-gray-200' : ''}`}
                onClick={() => {
                    setShowList(!showList);
                }}
            >
                <h2>{props.list === 'tasks' ? 'Your Tasks' : toTitleCase(props.list)}</h2>
                <h2 className={`${showList ? 'rotate-180' : ''}`}>
                    <MdKeyboardArrowDown />
                </h2>
            </button>

            <div
                style={{ height: showList ? `${40 + lists.length * 40}px` : '0px' }}
                className={`bg-white ${
                    showList ? 'border py-1' : 'border-none py-0'
                } fixed top-16 right-[5.3rem] w-48 overflow-y-hidden rounded-md border-gray-200 shadow-md duration-200 ease-in`}
            >
                <ul className='border-b border-b-gray-200'>
                    {lists.map(l => {
                        return (
                            <li className='rounded-md py-2 px-3 duration-500 hover:bg-gray-200' key={l}>
                                {props.list === l ? (
                                    <div aria-label='Currently selected list' className='flex items-center justify-between'>
                                        <h2 className='text-sm'>{l === 'tasks' ? 'Your Tasks' : l}</h2>
                                        <MdCheck className='text-xl' />
                                    </div>
                                ) : (
                                    <button
                                        aria-label={`Select list: ${l}`}
                                        className='flex w-full items-center justify-between'
                                        onClick={() => {
                                            setShowList(false);
                                            props.setList(l);
                                        }}
                                    >
                                        <h2 className='text-sm'>{l === 'tasks' ? 'Your Tasks' : l}</h2>
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <button
                    onMouseEnter={() => {
                        setShowPlus(true);
                    }}
                    onMouseLeave={() => {
                        setShowPlus(false);
                    }}
                    onClick={() => setUpCreate()}
                    className={`flex w-full justify-between rounded-md py-2 px-3 duration-500 hover:bg-gray-200 ${darkBg ? 'bg-gray-400' : ''}`}
                >
                    <h2 className='text-sm'>Create new list</h2>
                    <h2 className={`text-xl duration-500 ${showPlus ? '' : 'opacity-0'}`}>
                        <MdAdd />
                    </h2>
                </button>
            </div>

            <TaskListCreator show={showCreate} setShow={setShowCreate} />
        </div>
    );
}
