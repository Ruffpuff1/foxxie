export default function Header() {
    return (
        <div className='flex flex-col items-center justify-center space-y-5'>
            <h1 className='text-5xl font-[400] duration-200 hover:text-blue-900'>My Work</h1>

            <a href='/my-work#all-projects' className='rounded-md bg-blue-500 py-[12px] px-[24px] text-white duration-200 hover:bg-blue-600 hover:shadow-md'>
                View all
            </a>
        </div>
    );
}
