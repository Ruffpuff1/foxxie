import FieldsTable, { Field } from '@developers/FieldsTable/FieldsTable';

const Fields: Field[] = [
    {
        key: 'key',
        type: 'string',
        description: "The Villager's name and the key to look it up with."
    },
    {
        key: 'keyJp',
        type: 'string',
        description: "The Japanese translation of the Villager's name."
    },
    {
        key: 'gender',
        type: (
            <>
                string{' '}
                <span>
                    (
                    <a className='text-blue-500' href='#gender-enum'>
                        GenderEnum
                    </a>
                    )
                </span>
            </>
        ),
        description: 'The gender of the Villager.'
    },
    {
        key: 'personality',
        type: (
            <>
                string{' '}
                <span>
                    (
                    <a className='text-blue-500' href='#personalities-enum'>
                        PersonalitiesEnum
                    </a>
                    )
                </span>
            </>
        ),
        description: 'The personality of the Villager.'
    },
    {
        key: 'species',
        type: (
            <>
                string{' '}
                <span>
                    (
                    <a className='text-blue-500' href='#species-enum'>
                        SpeciesEnum
                    </a>
                    )
                </span>
            </>
        ),
        description: 'The species type of the Villager.'
    },
    {
        key: 'favoriteSaying',
        type: 'string',
        description: "The Villager's favorite saying."
    },
    {
        key: 'catchphrase',
        type: 'string',
        description: "The Villager's catchphrase."
    },
    {
        key: 'description',
        type: 'string',
        description: 'How the Villager is described in Animal Crossing Pocket Camp.'
    },
    {
        key: 'games',
        type: (
            <>
                string[]{' '}
                <span>
                    (
                    <a className='text-blue-500' href='#games-enum'>
                        GamesEnum
                    </a>
                    )
                </span>
            </>
        ),
        description: 'An array of Animal Crossing games the Villager appears in.'
    },
    {
        key: 'art',
        type: 'string',
        description: 'An image of the Villager.'
    },
    {
        key: 'song',
        type: (
            <>
                string{' '}
                <span>
                    (
                    <a className='text-blue-500' href='#kk-slider-songs'>
                        KKSliderSongs
                    </a>
                    )
                </span>
            </>
        ),
        description: "The Villager's favorite K.K. Slider song."
    },
    {
        key: 'siblings',
        type: 'string | undefined',
        description: "The Villager's siblings as described in Animal Crossing New Leaf."
    },
    {
        key: 'skill',
        type: 'string | undefined',
        description: "The Villager's skill as described in Animal Crossing New Leaf."
    },
    {
        key: 'goal',
        type: 'string | undefined',
        description: "The Villager's goal as described in Animal Crossing New Leaf."
    },
    {
        key: 'coffeeRequest',
        type: (
            <>
                undefined | object{' '}
                <span>
                    (
                    <a className='text-blue-500' href='#coffee'>
                        Coffee
                    </a>
                    )
                </span>
            </>
        ),
        description: 'Which type of coffee the Villager would prefer in Animal Crossing New Leaf.'
    }
];

export default function VillagerRefrenceFieldsTable() {
    return <FieldsTable fields={Fields} />;
}
