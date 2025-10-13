import Express from 'express';
import dotenv from 'dotenv';
import jayson from 'jayson/promise/index.js';
import methods from './methods/index.js';
import debug from './log.js';
import path from 'node:path';
import jsonwebtoken from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

dotenv.config();

const log = debug.extend('rpc');

const app = new Express();
const server = new jayson.Server(methods);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = readFileSync(process.env.VONAGE_PRIVATE_KEY);
const publicPath = path.join(__dirname, '..', 'public');
log(`Public path ${publicPath}`);

app.use(Express.static(publicPath));
app.use(Express.json());

app.post('/rpc', (req, res, next) => {
  log('RPC call');

  const header = req.headers?.authorization ?? '';
  const token = header.replace(/^Bearer\s+/i, '').trim();

  const body = {
    ...req.body,
    params: {
      ...(req.body?.params || {}),
    },
  };
  let decoded;
  if (token) {
    try {
      decoded = jsonwebtoken.verify(
        token,
        privateKey,
        {
          algorithms: ['RS256', 'HS256'],
        },
      );

      body.params._auth = decoded;
      log('JWT Decoded', decoded);
    } catch (error) {
      console.error('Error decoding JWT', error);
    }
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

    log('NO content');

    res.status(204);
    res.send('');
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
  log('Listening at http://localhost:3000/rpc');
});

