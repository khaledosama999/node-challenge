import config from 'config';
import context from './middleware/context';
import { router as expensesRoutes } from '@nc/domain-expense';
import express from 'express';
import gracefulShutdown from '@nc/utils/graceful-shutdown';
import helmet from 'helmet';
import security from './middleware/security';
import setupGraphQlServer from './graphql-server';
import { router as userRoutes } from '@nc/domain-user';
import { createServer as createHTTPServer, Server } from 'http';
import { createServer as createHTTPSServer, Server as SecureServer } from 'https';

const app = express();
const server: Server | SecureServer = (config.https.enabled === true) ? createHTTPSServer(config.https, app as any) : createHTTPServer(app as any);

server.ready = false;

gracefulShutdown(server);

// Remove content security policy headers to access the graphql playground
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));

app.get('/readycheck', function readinessEndpoint(req, res) {
  const status = (server.ready) ? 200 : 503;
  res.status(status).send(status === 200 ? 'OK' : 'NOT OK');
});

app.get('/healthcheck', function healthcheckEndpoint(req, res) {
  res.status(200).send('OK');
});

app.use(context);
app.use(security);

app.use('/user', userRoutes);
app.use('/expenses', expensesRoutes);

// Register the not found path after the path for graphql api is registered to our express app
setupGraphQlServer(server, app)
  .then(() => {
    app.use(function(err, req, res) {
      res.status(500).json(err);
    });
  });

export default server;
