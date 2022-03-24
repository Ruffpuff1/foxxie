import { Nav } from '../navigation/Nav';
import { Content } from '../presentational/Content';
import { TermsSection } from '../../utils/types';
import { Conduct } from '../headers/Conduct';

const sections: TermsSection[] = [
    {
        heading: '',
        body: [
            ''
        ].join(' '),
        extra: ''
    },
    {
        heading: '',
        body: [
            ''
        ].join(' ')
    }
];

export function Conductpage() {
    return (
        <div>
            <Nav />

            <Content>
                <Conduct />

                <div className='pb-10'>
                    {
                        sections.map(({ heading, body, extra }, i) => {
                            return (
                                <div key='heading' className='pt-10'>
                                    <h2 className='text-xl text-white font-source-sans px-20 font-bold'>
                                        {`${i + 1}).`} {heading}
                                    </h2>
                                    <p className='text-light-white font-source-sans px-24 font-normal mt-2'>
                                        {body}
                                    </p>
                                    {
                                        extra && <>
                                            <br />
                                            <p className='text-light-white font-source-sans px-24 font-normal mt-2'>
                                                {extra}
                                            </p>
                                        </>
                                    }
                                </div>
                            );
                        })
                    }
                </div>

            </Content>
        </div >
    );
}
