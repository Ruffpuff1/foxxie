import { toTitleCase } from '@ruffpuff/utilities';
import Link from '@ui/Link/Link';

export default function Preview({ boxes }: Props) {
    return (
        <div className='flex flex-col items-start justify-center space-y-2 p-[20px] lg:flex-row lg:items-center lg:justify-start lg:space-x-2 lg:space-y-0'>
            {boxes.map(box => {
                return (
                    <Link
                        href={box.href}
                        key={box.title}
                        className='flex min-h-[95px] min-w-[90%] flex-col items-start justify-start rounded-lg border px-7 py-2 text-gray-700 duration-200 hover:shadow-md lg:w-[30%] lg:min-w-[30%]'
                    >
                        <h2 className='mb-2 text-[16px] font-[500] text-blue-500 active:underline lg:text-[17px]'>{toTitleCase(box.title)}</h2>

                        <p className='text-sm text-[#202124] lg:text-[15px]'>{box.description}</p>
                    </Link>
                );
            })}
        </div>
    );
}

interface Props {
    boxes: Box[];
}

export interface Box {
    title: string;
    description: string;
    href: string;
}
