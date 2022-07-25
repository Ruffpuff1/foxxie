import Image from 'next/image';
import { projects } from '../../../../assets/projects';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

export default function ProjectsList() {
    const router = useRouter();
    const [showList, setShowList] = useState(true);

    return (
        <>
            <button
                onClick={() => {
                    setShowList(!showList);
                }}
                className={`project-box mt-10 flex w-full items-center justify-start space-x-3 py-5 px-5 hover:bg-gray-50 md:hidden ${
                    showList ? 'border-b-2 border-b-black hover:rounded-t-md' : 'border-y border-y-gray-300 hover:rounded-md'
                }`}
            >
                <h3 className='text-lg'>Show all</h3>
                <MdExpandMore className={`duration-200 ${showList ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`project-menu w-full overflow-hidden md:mt-10 ${showList ? 'h-[567px] md:h-auto' : 'h-0 md:h-auto'}`}>
                {projects.map((list, idx) => {
                    return (
                        <li key={idx} className='mx-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
                            {list.map(p => {
                                return (
                                    <button
                                        key={p.name}
                                        onClick={() => router.push(p.homepage)}
                                        className='project-box flex w-full items-center justify-start space-x-3 border-t py-5 hover:rounded-md hover:bg-gray-50 md:w-[95%] lg:w-[90%]'
                                    >
                                        <Image src={p.icon} width={40} height={40} alt='' />
                                        <h3 className='text-lg'>{p.name}</h3>
                                    </button>
                                );
                            })}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
