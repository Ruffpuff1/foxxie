import { Images } from '../../../assets/images';

export default function HomeImage() {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={Images.Reese} className='mb-8 h-[270px] w-[270px] md:mb-0 md:h-[90px] md:w-[90px] md:rounded-full' alt='Me looking puzzled at the camera' />
    );
}
