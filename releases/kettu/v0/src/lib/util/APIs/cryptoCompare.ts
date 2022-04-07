import { centra } from '@foxxie/centra';
import type { NonNullObject } from '@sapphire/utilities';

export interface CryptoCompareResultError {
    Response: 'Error';
    Message: string;
    HasWarning: boolean;
    Type: number;
    RateLimit: CryptoCompareResultErrorData;
    Data: CryptoCompareResultErrorData;
    ParamWithError: string;
}

export type CryptoCompareResultErrorData = NonNullObject;

export type CryptoCompareResult = CryptoCompareResultOk | CryptoCompareResultError;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CryptoCompareResultOk extends Record<string, number> {}

export async function cryptoCompare(from: string, to: string) {
    const result = await centra('https://min-api.cryptocompare.com/data/price')
        .query(`fsym`, from)
        .query(`tsyms`, to)
        .query(`extraParams`, `Kettu ${process.env.CLIENT_VERSION} Discord Bot`)
        .header(`authorization`, `Apikey ${process.env.CRYPTOCOMPARE_TOKEN}`)
        .json<CryptoCompareResult>();

    return result;
}
