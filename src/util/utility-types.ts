export type Meta<T extends Record<string | number | symbol, any>> = Spread<
    T,
    {
        title: string;
        description: string;
    }
>;

export type AddDescription<T extends string> = Spread<Join<T>, Join<`${T}Description`>>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AddBook<T extends string> = {
    book: Join<T>;
};

export type Join<T extends string> = {
    [key in T]: string;
};

// Names of properties in T with types that include undefined
export type OptionalPropertyNames<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];

// Common properties from L and R with undefined in R[K] replaced by type in L[K]
export type SpreadProperties<L, R, K extends keyof L & keyof R> = { [P in K]: L[P] | Exclude<R[P], undefined> };

export type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never; // see note at bottom*

export type Spread<L, R> = Id<
    // Properties in L that don't exist in R
    Pick<L, Exclude<keyof L, keyof R>> &
        // Properties in R with types that exclude undefined
        Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
        // Properties in R, with types that include undefined, that don't exist in L
        Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
        // Properties in R, with types that include undefined, that exist in L
        SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

export type Obj<K extends string | number | symbol, V> = {
    [key in K]: V;
};
