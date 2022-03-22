import { ReactNode } from "react";

export function Guidepage(props: { children: ReactNode; title: string, summary: string; }) {
    return (
        <div>
            <h1 className="font-bold text-white text-4xl ml-9">
                {props.title}
            </h1>
            <p className='text-light-white font-semibold mx-9 mt-3'>
                {props.summary}
            </p>

            {props.children}
        </div>
    );
}
