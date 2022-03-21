import { ReactNode } from "react";

export function Content(props: { children: ReactNode; }) {
    return (
        <div className='pt-32'>
            {props.children}
        </div>
    );
}
