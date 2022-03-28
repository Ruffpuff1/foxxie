import { ReactNode } from "react";

export function Content(props: { children: ReactNode; }) {
    return (
        <div className='pt-20 lg:pt-36 xl:pt-40'>
            {props.children}
        </div>
    );
}
