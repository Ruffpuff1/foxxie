import Image from 'next/image';
import { useRouter } from 'next/router';

export default function FeaturedProjects() {
    const router = useRouter();
    const nav = (url: string) => router.push(url);

    return (
        <div className='mt-20 flex-col md:mt-0 md:flex md:items-center'>
            <div className='flex flex-col justify-center space-y-10 md:flex-row md:items-center md:space-x-10'>
                <button onClick={() => nav('/foxxie')} className='w-[265px] rounded-md border border-gray-300 duration-150 hover:shadow-md'>
                    <Image width={210} height={210} src='https://reese.cafe/images/icons/foxxie.png' alt='' />

                    <div className='bg-gray-100 py-4 px-5'>
                        <h2 className='flex items-center justify-center text-xl'>Easily build and manage communities with Foxxie</h2>
                    </div>
                </button>

                <button onClick={() => nav('/developers')} className='w-[265px] rounded-md border border-gray-300 duration-150 hover:shadow-md'>
                    <Image width={210} height={210} src='https://reese.cafe/images/icons/developers.png' alt='' />

                    <div className='bg-gray-100 py-4 px-5'>
                        <h2 className='flex items-center justify-center text-xl'>Developer tooling, guides, and REST APIs</h2>
                    </div>
                </button>
            </div>

            <button onClick={() => nav('/todo')} className='mt-10 w-[265px] rounded-md border border-gray-300 duration-150 hover:shadow-md'>
                <Image width={210} height={210} src='https://reese.cafe/images/icons/todo.png' alt='' />

                <div className='bg-gray-100 py-4 px-5'>
                    <h2 className='flex items-center justify-center text-xl'>Keep track of tasks with todo</h2>
                </div>
            </button>
        </div>
    );
}
