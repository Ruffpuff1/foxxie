import { useRouter } from 'next/router';
import { MdExpandMore } from 'react-icons/md';

export default function DownArrow({ url }: { url: string }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(url)}
            className='mt-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 duration-200 hover:mt-11 hover:shadow-md'
        >
            <MdExpandMore />
        </button>
    );
}
