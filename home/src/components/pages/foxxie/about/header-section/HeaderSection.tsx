import Header from './Header';
import HeaderImageWrapper from './HeaderImageWrapper';
import JoinServerButton from './JoinServerButton';

export default function HeaderSection() {
    return (
        <section className='flex h-[100vh] flex-col items-center justify-center'>
            <HeaderImageWrapper>
                <Header />
                <JoinServerButton />
            </HeaderImageWrapper>
        </section>
    );
}
