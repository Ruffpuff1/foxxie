import { MdSend } from 'react-icons/md';

export default function OtherDescriptionStep({ submitDescription, setDescription, description, step }: Props) {
    const percent = parseInt(step, 10) < 5 ? '110%' : parseInt(step, 10) > 5 ? '-110%' : '0px';
    const validDescription = description.length <= 1000;

    return (
        <div style={{ transform: `translate3d(${percent},0px,0px)` }} className={`slide-step absolute mt-3 flex w-full flex-col items-center`}>
            <span className={`mb-2 text-xs text-red-500 duration-300 ${validDescription ? 'opacity-0' : 'opacity-100'}`}>
                Please keep description under 1000 characters.
            </span>
            <div className='flex items-center justify-center space-x-3'>
                <textarea
                    name='description'
                    id='hire-description-textarea'
                    onChange={e => {
                        setDescription(e.target.value);
                    }}
                    placeholder='Words...'
                    className={`rounded-md p-2 ${description.length > 23 ? 'w-96' : 'w-44'} border bg-transparent ${
                        description === '' || description.length <= 3 || validDescription ? '' : 'border-b-2 border-b-red-500'
                    }`}
                />
                <button
                    onClick={() => {
                        if (!validDescription) return;
                        submitDescription();
                    }}
                >
                    <MdSend className={`text-xl duration-300 hover:text-blue-500 ${validDescription ? 'opacity-100' : 'cursor-default opacity-0'}`} />
                </button>
            </div>
        </div>
    );
}

interface Props {
    setDescription: (description: string) => void;
    submitDescription: () => void;
    description: string;
    step: string;
}
