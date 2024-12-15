import { WebsiteType } from '../../../../pages/api/message';

export default function SiteTypeStep({ setType, step }: Props) {
    const percent = parseInt(step, 10) < 2 ? '110%' : parseInt(step, 10) > 2 ? '-110%' : '0px';

    return (
        <div
            style={{ transform: `translate3d(${percent},0px,0px)` }}
            className={`slide-step absolute mt-10 flex w-full flex-col items-center space-y-5 md:flex-row md:justify-center md:space-y-0 md:space-x-5`}
        >
            <button
                onClick={() => {
                    setType('static');
                }}
                className='group flex flex-col items-center justify-center rounded-md border py-2 px-5 duration-200 hover:shadow-md'
            >
                <h3 className='font-[450] group-hover:underline'>Static site</h3>
                <p>Page rendered as HTML ahead of time</p>
            </button>

            <button
                onClick={() => {
                    setType('dynamic');
                }}
                className='group flex flex-col items-center justify-center rounded-md border py-2 px-5 duration-200 hover:shadow-md'
            >
                <h3 className='font-[450] group-hover:underline'>Dynamic site</h3>
                <p>Page rendered as HTML on every request</p>
            </button>
        </div>
    );
}

interface Props {
    setType: (type: WebsiteType) => void;
    step: string;
}
