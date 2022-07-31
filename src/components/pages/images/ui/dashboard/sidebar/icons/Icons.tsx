import { useState } from 'react';
import LargeTopIcons from './LargeTopIcons';
import SmallBottomIcons from './SmallBottomIcons';

export default function Icons() {
    const [open, setOpen] = useState(true);

    return (
        <>
            <LargeTopIcons open={open} setOpen={setOpen} />
            <SmallBottomIcons open={open} />
        </>
    );
}
