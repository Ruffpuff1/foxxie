import { useRouter } from 'next/router';
import { MdFolder } from 'react-icons/md';
import { FolderPath } from 'src/hooks/useFolder';

export default function FolderDots(props: { show: boolean; links: FolderPath[] | null }) {
    const router = useRouter();

    return (
        <ul
            className={`fixed top-[7.5rem] left-2 w-72 rounded-md border-2 border-gray-100 border-opacity-50 bg-white py-2 shadow-lg lg:left-[22rem] ${
                props.show ? 'block' : 'hidden'
            }`}
        >
            {props.links &&
                props.links.map(folder => {
                    return (
                        <li key={folder.id}>
                            <button
                                onClick={() => router.push(`/images/folder?id=${folder.id}`, undefined, { shallow: true })}
                                className='flex w-full items-center justify-start rounded-md px-2 duration-500 hover:bg-gray-200'
                            >
                                <div className='flex items-center'>
                                    <MdFolder className='text-xl' />
                                    <h2 className='w-full p-2'>{folder.name}</h2>
                                </div>
                            </button>
                        </li>
                    );
                })}
        </ul>
    );
}
