import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** A character's family relation. */
export type FamilyRelation = {
  readonly __typename?: 'FamilyRelation';
  /** The name of the family member. */
  readonly key: VillagersEnum;
  /** How the villager is related. */
  readonly relation: Scalars['String'];
};

/** The locations a villager can live. */
export enum LivesInEnum {
  CindersapForest = 'CindersapForest',
  GingerIsland = 'GingerIsland',
  PelicanTown = 'PelicanTown',
  TheBeach = 'TheBeach',
  TheDesert = 'TheDesert',
  TheMines = 'TheMines',
  TheMountain = 'TheMountain',
  TheSewers = 'TheSewers'
}

export type Query = {
  readonly __typename?: 'Query';
  /** Get details on a Stardew valley character. */
  readonly getFuzzyVillagerByName: ReadonlyArray<Villager>;
  /** Get details on a Stardew valley character. */
  readonly getVillagerByName: Villager;
};


export type QueryGetFuzzyVillagerByNameArgs = {
  take?: InputMaybe<Scalars['Float']>;
  villager: Scalars['String'];
};


export type QueryGetVillagerByNameArgs = {
  take?: InputMaybe<Scalars['Float']>;
  villager: Scalars['String'];
};

/** A character's data. */
export type Villager = {
  readonly __typename?: 'Villager';
  /** The address of the villager. */
  readonly address: Scalars['String'];
  /** The best gifts to gift to this villager. */
  readonly bestGifts: ReadonlyArray<Scalars['String']>;
  /** The birthday of the villager. */
  readonly birthday: Scalars['String'];
  /** A description of the villager. */
  readonly description?: Maybe<Scalars['String']>;
  /** The family of the villager. */
  readonly family: ReadonlyArray<FamilyRelation>;
  /** The friends of the villager. */
  readonly friends: ReadonlyArray<VillagersEnum>;
  /** The name of the villager and the key by which it's stored. */
  readonly key: VillagersEnum;
  /** The location the villager lives in. */
  readonly livesIn: LivesInEnum;
  /** If you are able to marry this villager. */
  readonly marriage: Scalars['Boolean'];
  /** The portrait of the villager. */
  readonly portrait?: Maybe<Scalars['String']>;
};

/** The villagers in the API. */
export enum VillagersEnum {
  Abigail = 'abigail',
  Alex = 'alex',
  Caroline = 'caroline',
  Clint = 'clint',
  Demetrius = 'demetrius',
  Dwarf = 'dwarf',
  Elliott = 'elliott',
  Emily = 'emily',
  Evelyn = 'evelyn',
  George = 'george',
  Gus = 'gus',
  Haley = 'haley',
  Harvey = 'harvey',
  Jas = 'jas',
  Jodi = 'jodi',
  Kent = 'kent',
  Krobus = 'krobus',
  Leah = 'leah',
  Leo = 'leo',
  Lewis = 'lewis',
  Linus = 'linus',
  Marnie = 'marnie',
  Maru = 'maru',
  Pam = 'pam',
  Penny = 'penny',
  Pierre = 'pierre',
  Robin = 'robin',
  Sam = 'sam',
  Sandy = 'sandy',
  Sebastian = 'sebastian',
  Shane = 'shane',
  Vincent = 'vincent',
  Willy = 'willy',
  Wizard = 'wizard'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  FamilyRelation: ResolverTypeWrapper<FamilyRelation>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  LivesInEnum: LivesInEnum;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Villager: ResolverTypeWrapper<Villager>;
  VillagersEnum: VillagersEnum;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  FamilyRelation: FamilyRelation;
  Float: Scalars['Float'];
  Query: {};
  String: Scalars['String'];
  Villager: Villager;
};

export type FamilyRelationResolvers<ContextType = any, ParentType extends ResolversParentTypes['FamilyRelation'] = ResolversParentTypes['FamilyRelation']> = {
  key?: Resolver<ResolversTypes['VillagersEnum'], ParentType, ContextType>;
  relation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getFuzzyVillagerByName?: Resolver<ReadonlyArray<ResolversTypes['Villager']>, ParentType, ContextType, RequireFields<QueryGetFuzzyVillagerByNameArgs, 'villager'>>;
  getVillagerByName?: Resolver<ResolversTypes['Villager'], ParentType, ContextType, RequireFields<QueryGetVillagerByNameArgs, 'villager'>>;
};

export type VillagerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Villager'] = ResolversParentTypes['Villager']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bestGifts?: Resolver<ReadonlyArray<ResolversTypes['String']>, ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  family?: Resolver<ReadonlyArray<ResolversTypes['FamilyRelation']>, ParentType, ContextType>;
  friends?: Resolver<ReadonlyArray<ResolversTypes['VillagersEnum']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['VillagersEnum'], ParentType, ContextType>;
  livesIn?: Resolver<ResolversTypes['LivesInEnum'], ParentType, ContextType>;
  marriage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  portrait?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  FamilyRelation?: FamilyRelationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Villager?: VillagerResolvers<ContextType>;
};

