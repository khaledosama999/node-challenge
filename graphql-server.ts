import { ApolloServer } from 'apollo-server-express';
import { Application } from 'express';
import config from 'config';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive';
import ExpensesResolvers from './packages/domains/expense/resolvers';
import { loadFilesSync } from '@graphql-tools/load-files';
import Logger from '@nc/utils/logging';
import path from 'path';
import { Server as SecureServer } from 'https';
import { Server } from 'http';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

const logger = Logger('server');

export const setupGraphQlServer = async (server: Server | SecureServer, app: Application) => {
  // Merge the different graphql schemas from all our different domains into one
  const typesArray = loadFilesSync(path.join(__dirname, 'packages/domains/**/*.graphql'));
  const typeDefs = mergeTypeDefs(typesArray);

  // Same for resolvers
  const resolversArray = [ExpensesResolvers];
  const resolvers = mergeResolvers(resolversArray);

  const graphqlServer = new ApolloServer({
    typeDefs: [constraintDirectiveTypeDefs, typeDefs],
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: server }),
      config.env === 'development' && ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  // Add the graphQl server to the express app at path /graphql
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app, path: '/graphql' });

  server.listen(config.port, () => {
    server.ready = true;
    logger.log(`Server started on port ${config.port}`);
  });

  return graphqlServer;
};

export default setupGraphQlServer;
