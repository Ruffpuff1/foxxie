import { TodoContext, useTodo } from '@hooks/useTodo';
import { useContext, useState } from 'react';
import { MdAddTask } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import TodoItem from './TodoItem';
import TodoPlaceholder from './TodoPlaceholder';
import TaskListSelector from './TaskListSelector';

export default function Todolist() {
    const [placeholder, setPlaceholder] = useState('');
    const [showComplete, setShowComplete] = useState(false);
    const [taskList, setTaskList] = useState('tasks');

    const { showTodo, setShowTodo } = useContext(TodoContext);
    const [todos, todoLists] = useTodo();

    const complete = todos.filter(t => t.completed);
    const notComplete = todos.filter(t => !t.completed);

    return (
        <div className={`fixed top-0 right-0 z-[4] h-full whitespace-nowrap bg-white pt-3 pr-0 shadow-lg duration-200 ease-in ${showTodo ? 'w-[288px]' : 'w-0'}`}>
            <div role='tabpanel' aria-label='Tasks'>
                <div className='flex items-center justify-between border-b border-b-gray-200 px-1 py-[2px]'>
                    <div className='ml-2 mb-2'>
                        <h2 className='pb-1 text-xs opacity-50'>TODO</h2>
                        <TaskListSelector list={taskList} setList={setTaskList} lists={todoLists} />
                    </div>
                    <button
                        aria-label='Close todo list'
                        className='rounded-full p-2 text-xl duration-500 hover:bg-gray-100'
                        onClick={() => {
                            setShowTodo(false);
                        }}
                    >
                        <IoMdClose />
                    </button>
                </div>
                <div className='flex items-center justify-between'>
                    <button
                        onClick={() => {
                            setPlaceholder('1');
                        }}
                        className='flex w-full items-center justify-start space-x-3 rounded-full py-2 px-3 text-blue-500 duration-500 hover:bg-gray-200'
                    >
                        <h2 className='text-xl'>
                            <MdAddTask />
                        </h2>
                        <h2>Add a task</h2>
                    </button>
                    <button
                        aria-label='View list options'
                        onClick={() => {
                            /* */
                        }}
                        className='flex items-center justify-start space-x-3 rounded-full py-2 px-2 text-xl duration-500 hover:bg-gray-200'
                    >
                        <BsThreeDotsVertical />
                    </button>
                </div>
            </div>
            <div
                style={{ height: `${notComplete.filter(a => a.list === taskList).length * 65 + (placeholder ? 65 : 0)}px` }}
                className='mb-5 h-[65px] overflow-y-auto duration-200 ease-in'
            >
                {Boolean(notComplete.filter(a => a.list === taskList)) && (
                    <ul>
                        {placeholder && <TodoPlaceholder list={taskList} key={placeholder} setPlaceholder={setPlaceholder} />}
                        {notComplete
                            .filter(a => a.list === taskList)
                            .sort((a, b) => a.completeBy.toDate().getTime() - b.completeBy.toDate().getTime())
                            .map(td => {
                                return <TodoItem todo={td} key={td.id} />;
                            })}
                    </ul>
                )}
            </div>
        </div>
    );
}
