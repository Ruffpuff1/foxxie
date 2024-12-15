export default function NumberPagesStep({ setNumberPages, step }: Props) {
    const percent = parseInt(step, 10) < 3 ? '110%' : parseInt(step, 10) > 3 ? '-110%' : '0px';

    return (
        <div style={{ transform: `translate3d(${percent},0px,0px)` }} className={`slide-step absolute mt-10 flex w-full flex-col items-center space-y-5`}>
            <div className='flex items-center justify-center space-x-5'>
                <button
                    onClick={() => {
                        setNumberPages('1');
                    }}
                    className='group flex flex-col items-center justify-center rounded-md border py-2 px-5 duration-200 hover:shadow-md'
                >
                    <h3 className='font-[450] group-hover:underline'>Single page</h3>
                    <p></p>
                </button>

                <button
                    onClick={() => {
                        setNumberPages('5');
                    }}
                    className='group flex flex-col items-center justify-center rounded-md border py-2 px-5 duration-200 hover:shadow-md'
                >
                    <h3 className='font-[450] group-hover:underline'>Two - five pages</h3>
                    <p></p>
                </button>
            </div>

            <div className='flex items-center justify-center space-x-5'>
                <button
                    onClick={() => {
                        setNumberPages('10');
                    }}
                    className='group flex flex-col items-center justify-center rounded-md border py-2 px-5 duration-200 hover:shadow-md'
                >
                    <h3 className='font-[450] group-hover:underline'>Six - ten pages</h3>
                    <p></p>
                </button>

                <button
                    onClick={() => {
                        setNumberPages('11');
                    }}
                    className='group flex flex-col items-center justify-center rounded-md border py-2 px-5 duration-200 hover:shadow-md'
                >
                    <h3 className='font-[450] group-hover:underline'>Eleven or more pages</h3>
                    <p></p>
                </button>
            </div>
        </div>
    );
}

interface Props {
    setNumberPages: (type: `${number}`) => void;
    step: string;
}
