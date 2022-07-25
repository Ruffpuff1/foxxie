import { useRouter } from 'next/router';

export default function NavbarPageName({ name, link = '/' }: { name: string; link?: string }) {
    const router = useRouter();

    return (
        <button onClick={() => router.push(link)} className='whitespace-nowrap rounded-md px-5 py-3 text-2xl font-[400] duration-200 hover:bg-gray-100'>
            <span>Reese</span>
            <span className='cursor-pointer text-[#5F6367] hover:underline'>{name}</span>
        </button>
    );
}
