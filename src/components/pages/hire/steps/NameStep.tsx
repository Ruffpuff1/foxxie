import { MdSend } from 'react-icons/md';

export default function NameStep({ setName, name, submitName, step }: Props) {
    const percent = parseInt(step, 10) === 1 ? '0px' : '-110%';
    const validName = /[A-z]+ [A-z ]+/u.test(name);

    return (
        <div style={{ transform: `translate3d(${percent},0px,0px)` }} className={`slide-step absolute mt-10 flex w-full items-center justify-center space-x-3`}>
            <input
                type='text'
                name='name'
                pattern='\w+'
                onChange={e => {
                    setName(e.target.value);
                }}
                placeholder='John doe'
                className={`w-56 rounded-md border bg-transparent p-1 ${name === '' || name.length <= 3 || validName ? '' : 'border-b-2 border-b-red-500'}`}
            />
            <button
                onClick={() => {
                    submitName();
                }}
            >
                <MdSend className={`text-xl duration-500 hover:text-blue-500 ${validName ? 'opacity-100' : 'cursor-default opacity-0'}`} />
            </button>
        </div>
    );
}

interface Props {
    setName: (name: string) => void;
    submitName: () => void;
    name: string;
    step: string;
}
