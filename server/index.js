import Express from 'express';
import dotenv from 'dotenv';
import jayson from 'jayson/promise/index.js';
import methods from './methods/index.js';
import debug from './log.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jwtAuth } from './auth.js';

dotenv.config();

const log = debug.extend('express');

const app = new Express();
const server = new jayson.Server(methods);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
  dist: path.join(__dirname, '..', 'dist'),
  public: path.join(__dirname, '..', 'public'),
};

app.use(Express.static(paths.dist));

if (process.env.NODE_ENV === 'development') {
  app.use(Express.static(paths.public));
}

const publicPath = path.join(__dirname, '..', 'public');
log(`Public path ${publicPath}`);

app.use(Express.static(publicPath));
app.use(Express.json());
app.use((req, res, next) => {
  // Ignore API or asset requests
  if (req.path.startsWith('/rpc') || req.path.includes('.')) {
    return next();
  }

  const filePath = path.join(paths.dist, `${req.path}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      next(); // let Express handle 404 or fall back
    }
  });
});

app.post('/messages/inbound', (req) => {
  log('Inbound message', req.body);
});

app.post('/rpc', (req, res, next) => {
  log('RPC call');

  const body = {
    ...req.body,
    params: {
      ...(req.body?.params || {}),
    },
  };

  const rpcAuthCreds = jwtAuth(req);

  if (rpcAuthCreds) {
    body.params._auth = rpcAuthCreds;
  }

  server.call(body, (error, jsonRPCResponse) => {
    log('RPC Call complete');
    if (error instanceof Error) {
      console.error('Error', error);
      return next(error);
    }

    if (error) {
      log('RPC Error', error);
      res.status(400);
      res.send(error);
      return;
    }

    if (jsonRPCResponse) {
      log('jsonRPCResponse', jsonRPCResponse);
      res.send(jsonRPCResponse);
      return;
    }

    // this should never happen but we will guard for it
    log('No content');

    res.status(204);
    res.send('');
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  log('Listening at http://localhost:3000/rpc');
});

