import type { ServiceSchema } from "moleculer";

import type { 
  GatewayResponse, 
  IncomingRequest
} from "moleculer-web";



export default [
  {
    path: "/oauth",
    whitelist: ["**"],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {}
  },
  {
    path: '/oauth/token',
    aliases: {
      'POST /': function token(this:ServiceSchema, req: IncomingRequest, res:GatewayResponse, next: Function) {
        return this.accessToken(req, res, next);
      },
    },
    bodyParsers: {
      json: true,
      urlencoded: {
        extended: true,
      },
    },
  },
  {
    path: '/oauth/authorize',
    aliases: {
      'POST /': function auth(this:ServiceSchema, req:IncomingRequest, res:GatewayResponse, next:Function) {
        return this.authenticate(req, res, next);
      },
    },
    bodyParsers: {
      json: true,
      urlencoded: {
        extended: true,
      },
    },
  },
]