import type { ServiceSchema } from "moleculer";

import type { 
  GatewayResponse, 
  IncomingRequest
} from "moleculer-web";


export default [
  {
    path: "/login",
    whitelist: ["**"],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'POST /': async function(this:ServiceSchema, req:IncomingRequest & { body: any}, res:GatewayResponse, _next:Function){
        const { username, email, password } = req.body;
        try {
          const data = await this.broker.call('accounts.login', { username, email, password });
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (error:any) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
      },
    },
  },
  {
    path: "/logout",
    whitelist: ["**"],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'POST /': 'accounts.logout',
    },
  },
  {
    path: "/register",
    whitelist: ["**"],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'POST /': 'accounts.register',
    },
  },
  {
    path: "/whoami",
    whitelist: ["**"],
    authentication: true,
    // authorization: true,
    autoAliases: false,
    aliases: {
      'GET /': 'accounts.whoami',
    },
  },
]