import { Story } from '@assets/arts-and-culture/structures';

export default function Banner({ story }: { story: Story }) {
    return (
        <div
            className='h-[100vh] w-full bg-cover bg-no-repeat'
            style={{
                backgroundImage: `url('${story.bannerUrl}')`
            }}
        >
            <div className='h-[100vh] w-full bg-black bg-opacity-70' />
        </div>
    );
}
