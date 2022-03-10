import type { GraphQLSchema } from 'graphql';
import { buildSchema, registerEnumType } from 'type-graphql';
import { ApolloServer } from 'apollo-server-koa';
import { villagers as villagerData } from './data';
import Koa from 'koa';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { VillagerResolver } from './resolvers';

export const villagers = villagerData.enum();

export const buildGqlSchema = (): Promise<GraphQLSchema> => {
    registerEnumType(villagers, {
        name: 'VillagersEnum',
        description: 'The villagers in the API.'
    });

    return buildSchema({
        resolvers: [VillagerResolver],
        dateScalarMode: 'isoDate'
    });
};

export const gqlServer = async () => {
    const schema = await buildGqlSchema();
    const app = new Koa();

    const server = new ApolloServer({
        schema,
        introspection: true,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
                settings: {
                    'editor.theme': 'dark',
                    'editor.reuseHeaders': true
                }
            })
        ]
    });

    await server.start();
    server.applyMiddleware({ app, path: '/', cors: true });

    return app;
};

export default gqlServer;
