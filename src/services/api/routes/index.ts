import type { ServiceSchema } from 'moleculer';
import type { GatewayResponse, IncomingRequest } from 'moleculer-web';

import api from './api';
import status from './status';
import oauth from './oauth';
import users from './users';
import front from './front';
import fake from './fake';

export default [
  {
    path: '/', // Trending
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'GET /': async function (
        this: ServiceSchema,
        _req: IncomingRequest & { body: any },
        res: GatewayResponse,
        _next: Function
      ) {
        try {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({"msg": "Welcome to the API"}));
        } catch (error: any) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
      },
    },
  },
  ...api, ...status, ...oauth, ...users, ...front, ...fake ] as any;
