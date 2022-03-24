import { useEffect } from "react";

export function Votepage(props: { url: string; }) {
    useEffect(() => {
        window.location.href = props.url;
    });

    return (
        <>
        </>
    );
}
