import { useEffect } from "react";

export function Invitepage(props: { perms?: string; }) {
    useEffect(() => {
        window.location.href = `https://discord.com/oauth2/authorize?client_id=945242473683353600${props.perms
            ? `&permissions=${props.perms}`
            : ''
            }&scope=bot%20applications.commands`;
    });

    return (
        <>
        </>
    );
}
