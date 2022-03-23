import { Nav } from '../navigation/Nav';
import { Terms } from '../headers/Terms';
import { Content } from '../presentational/Content';

const sections: { heading: string; body: string; extra?: string }[] = [
    {
        heading: 'Accepting the terms',
        body: [
            'By accepting these terms you agree that you are above the age of jurisdiction in your country.',
            'In cases where you invite the bots, selfhost the bots, website, or any other Foxxie material you have agreed to our Code of Conduct.',
            'If you wish to contribute to the project on Github your should follow the Conventional Commit format and draft a PR pertaining to the project you have submitted.'
        ].join(' '),
        extra: 'At any time we reserve the right to update there terms, if you object to the changes you shall cease usage of the service within seven days.'
    },
    {
        heading: 'Your rights to use this service',
        body: [
            'This service is considered a tool used primarily for fostering safe and productive communities.',
            'While using the service you are free to selfhost private iterations of the service at your own descretion.',
            'The Foxxie project at large is licensed under the MIT license, Copyright © Foxxie 2021.'
        ].join(' ')
    }
];

export function Termspage() {
    return (
        <div>
            <Nav />

            <Content>
                <Terms />

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
