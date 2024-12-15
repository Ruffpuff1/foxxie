import { SidebarContext, useTodo } from '@hooks/useTodo';
import { useContext, useEffect, useState } from 'react';
import { MdAddTask, MdClose, MdKeyboardArrowDown } from 'react-icons/md';
import TaskListSelector from './TaskListSelector';
import TodoComplete from './TodoComplete';
import TodoItem from './todoitem/TodoItem';
import TodoListOptions from './todolistoptions/TodoListOptions';
import TodoPlaceholder from './TodoPlaceholder';

export default function TodoList() {
    const [placeholder, setPlaceholder] = useState('');
    const [showComplete, setShowComplete] = useState(false);
    const [taskList, setTaskList] = useState(() => localStorage.getItem('selected-task-list') || 'tasks');

    const { showTodo, setShowTodo } = useContext(SidebarContext);
    const [todos, todoLists] = useTodo();

    const [sortBy, setSortBy] = useState(todoLists.find(l => l.name === taskList)?.sortBy as string);

    useEffect(() => {
        if (!todoLists.find(l => l.name === taskList)) {
            setTaskList('tasks');
        }

        if (taskList === 'tasks') {
            const v = localStorage.getItem('default-tasks-list-sort-by') || todoLists.find(l => l.name === taskList)!.sortBy;
            setSortBy(v);
        } else {
            const v = todoLists.find(l => l.name === taskList)?.sortBy as string;
            setSortBy(v);
        }
    }, [taskList, todoLists]);

    const complete = todos.filter(t => t.completed);
    const notComplete = todos.filter(t => !t.completed);

    const completeListHeight = showComplete ? complete.filter(a => a.list === taskList).length * 37 + 53 : 53;

    const notCompleteOnList = notComplete.filter(a => a.list === taskList);
    const completeOnList = complete.filter(a => a.list === taskList);

    const formatDate = (d: Date | null) => {
        if (d === null) return null;

        const now = Date.now();
        if (now > d.getTime()) return 'PAST';

        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(d);
    };

    const sortDates = sortBy === 'date';

    const dates = [...new Set(notCompleteOnList.map(c => formatDate(c.completeBy?.toDate() || null)).filter(a => a !== null))] as string[];

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
                        <MdClose />
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

                    <TodoListOptions
                        setTaskList={setTaskList}
                        setSortBy={setSortBy}
                        sortBy={sortBy}
                        listTodos={todos.filter(todo => todo.list === taskList)}
                        list={taskList}
                        setList={setTaskList}
                        lists={todoLists}
                    />
                </div>
            </div>

            <div
                style={{ height: `auto`, overflowY: placeholder ? 'auto' : 'hidden', paddingBottom: placeholder ? '2rem' : '0px' }}
                className='max-h-[650px] duration-200 ease-in'
            >
                <ul>
                    <TodoPlaceholder placeholder={placeholder} list={taskList} key={placeholder} setPlaceholder={setPlaceholder} />
                </ul>

                <ul className={`overflow-hidden ${sortDates ? 'h-0' : 'h-auto'}`}>
                    {notCompleteOnList
                        .sort((a, b) => a.completeBy?.toDate().getTime() || 0 - (b.completeBy?.toDate().getTime() || 0))
                        .map(td => {
                            return <TodoItem sortBy={sortBy} todo={td} key={td.id} />;
                        })}
                </ul>

                {dates.map(d => {
                    return (
                        <div key={d}>
                            <div className={`my-2 overflow-y-hidden ${d === 'PAST' ? 'text-red-600' : ''} ${sortDates ? 'h-[14px]' : 'h-0'}`}>
                                <h3 className='px-4 text-[11px] font-medium uppercase leading-[16px] tracking-[.8px]'>{d}</h3>
                            </div>

                            <ul className={`overflow-y-hidden duration-200 ${sortDates ? 'h-auto' : 'h-0'}`}>
                                {notCompleteOnList
                                    .filter(c => formatDate(c.completeBy?.toDate() || null) === d)
                                    .sort((a, b) => a.completeBy?.toDate().getTime() || 0 - (b.completeBy?.toDate().getTime() || 0))
                                    .map(td => {
                                        return <TodoItem sortBy={sortBy} todo={td} key={td.id} />;
                                    })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    height: completeOnList.length ? `${completeListHeight}px` : '0px'
                }}
                className={`fixed bottom-0 right-0 bg-white duration-200 ease-in ${showTodo ? 'w-72' : 'w-0'}`}
            >
                <div className='flex items-center justify-between border-y border-y-gray-200 px-2 py-[12px]'>
                    <h2>Completed ({completeOnList.length})</h2>
                    <button
                        aria-label={`${showComplete ? 'Close' : 'Open'} completed tasks`}
                        className={`p-1 text-xl delay-300 duration-200 ${showComplete ? '' : 'rotate-180'} ${showTodo ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => {
                            setShowComplete(!showComplete);
                        }}
                    >
                        <MdKeyboardArrowDown />
                    </button>
                </div>

                <div className={`max-h-[295px] overflow-y-auto duration-200 ${showComplete ? 'mb-2' : 'mb-0'}`}>
                    <ul>
                        {completeOnList
                            .sort((a, b) => a.completeBy?.toDate().getTime() || 0 - (b.completeBy?.toDate().getTime() || 0))
                            .map(td => {
                                return <TodoComplete todo={td} key={td.id} />;
                            })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
