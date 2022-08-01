/* eslint-disable @next/next/no-img-element */
export default function Flag({ visible, green, white, purple }: Props) {
    return (
        <div className='h-full w-full bg-black bg-opacity-70'>
            <div className={`h-[350px] w-2/5 overflow-hidden duration-200`}>
                <img
                    src='https://i.pinimg.com/originals/86/69/7e/86697e05d21d06f4d84eb946d015417e.jpg'
                    alt='MLM flag'
                    style={{
                        transition: 'filter 0.5s, width 0.3s, border-radius 0.3s, transform 0.3s, padding 0.3s, transform-origin 0.3s'
                    }}
                    className={`rounded-md ${visible ? `blur-none ${getScale(green, white, purple)}` : 'blur-sm'}`}
                />
            </div>
        </div>
    );
}

function getScale(green: boolean, white: boolean, purple: boolean) {
    if (green && !white && !purple) return 'scale-[4.5] origin-top';
    if (green && white && !purple) return 'scale-[4.5] origin-center';
    if (green && white && purple) return 'scale-[4.5] origin-bottom';
}

interface Props {
    visible: boolean;
    green: boolean;
    white: boolean;
    purple: boolean;
}
