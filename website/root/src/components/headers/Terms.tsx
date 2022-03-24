import { termsLastUpdated } from "../../utils/constants";
import { formatDate } from "../../utils/util";
import { Base } from "./Base";

export function Terms() {
    return (
        <>
            <Base
                title='Terms of Service'
                description={`Last updated on ${formatDate(termsLastUpdated)}`}
            />
        </>
    );
}
