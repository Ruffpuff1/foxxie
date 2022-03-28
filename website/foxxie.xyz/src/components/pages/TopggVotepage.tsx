import { Votepage } from "./Votepage";

export function TopggVotepage(props: { id: `${bigint}`; }) {
    return (
        <>
            <Votepage
                url={`https://top.gg/bot/${props.id}/vote`}
            />
        </>
    );
}

