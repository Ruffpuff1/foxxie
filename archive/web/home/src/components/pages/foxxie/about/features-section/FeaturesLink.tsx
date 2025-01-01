import { MdArrowDownward } from 'react-icons/md';

export default function FeaturesLink() {
    return (
        <div className='my-10'>
            <a
                href='#discord-ui'
                className='mx-10 flex w-40 items-center space-x-2 rounded-md bg-transparent px-5 py-1 text-xl font-semibold text-gray-600 duration-200 hover:bg-gray-100 md:px-2'
            >
                <MdArrowDownward />
                <span>Features</span>
            </a>
        </div>
    );
}
