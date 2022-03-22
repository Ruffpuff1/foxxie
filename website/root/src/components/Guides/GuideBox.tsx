import { ReactNode } from "react";

export function GuideBox(props: { children: ReactNode; }) {
    return (
        <p className='text-light-white font-semibold mx-9 mt-3'>
            {props.children}
        </p>
    );
}
