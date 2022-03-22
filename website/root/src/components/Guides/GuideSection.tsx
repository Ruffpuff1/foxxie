import { ReactNode } from "react";

export function GuideSection(props: { id: string, title: string; dontBreak?: boolean, children: ReactNode; }) {
    return (
        <div className='mt-10' id={props.id} >
            <h3 className='font-bold text-white text-xl ml-9'>
                {props.title}
            </h3>

            {props.children}
            {!props.dontBreak && <><br /><br /></>}
        </div>
    );
}
