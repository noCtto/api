import type { 
  ServiceSchema as Schema 
} from 'moleculer';

import type { 
  GatewayResponse, 
  IncomingRequest
} from 'moleculer-web';
import WithAuth from '../auth';

type Req = IncomingRequest & { body: any }
type Res = GatewayResponse;

export default [
  {
    path: '/all', // Trending
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'GET /': 'posts.all',
    },
  },
  {
    path: "/api/openapi",
    aliases: {
       "GET /openapi.json": "openapi.generateDocs", // swagger scheme
       "GET /ui": "openapi.ui", // ui
       "GET /assets/:file": "openapi.assets", // js/css files
    }
  },
  {
    path: '/p', // Posts
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'GET /': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'posts.all', false)
      },
      'GET /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'posts.get', false)
      },
      'POST /': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'posts.create')
      },
      'UPDATE /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'posts.get')
      },
      'DELETE /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'posts.get')
      },
    },
  },
  {
    name: 'communities',
    path: '/cs', // Communities
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'GET /': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.all', false)
      },
      'GET /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.get', false)
      },
      'POST /': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.create')
      },
      'POST /join': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.join')
      },
      'POST /:id/moderate': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.moderate')
      },
      'POST /leave': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.leave')
      },
      'UPDATE /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.update')
      },
      'DELETE /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'communities.get')
      },
    },
  },
  {
    path: '/c', // Comments
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'GET /': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'comments.all', false)
      },
      'GET /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'comments.get', false)
      },
      'POST /': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'comments.create')
      },
      'UPDATE /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'comments.update')
      },
      'DELETE /:id': async function (this: Schema,req: Req, res: Res ) {
        return WithAuth(req, res, 'comments.get')
      },
    },
  },
  {
    path: '/sb', // Subscribers
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    
    aliases: {
      'POST /': async function (
        this: Schema,
        req: Req,
        res: Res,
        _next: Function
      ) {
        return WithAuth(req, res, 'subscribers.create', false)
      },
    },
  },
  {
    path: '/aw', // Subscribers
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    
    aliases: {
      'POST /': async function (
        this: Schema,
        req: Req,
        res: Res,
        _next: Function
      ) {
        return WithAuth(req, res, 'awards.create', false)
      },
    },
  },
  {
    path: '/u', // Users
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    aliases: {
      'GET /:id': async function (
        this: Schema,
        req: Req,
        res: Res,
        _next: Function
      ) {
        return WithAuth(req, res, 'users.get', false)
      },
      'POST /follow': async function (
        this: Schema,
        req: Req,
        res: Res,
        _next: Function
      ) {
        return WithAuth(req, res, 'users.join', false)
      },
    },
  },
  {
    path: '/v', // Vote Cards
    whitelist: ['**'],
    authentication: false,
    authorization: false,
    autoAliases: false,
    
    aliases: {
      'POST /:id': async function (
        this: Schema,
        req: Req,
        res: Res,
        _next: Function
      ) {
        return WithAuth(req, res, 'votes.vote')
      },
      'GET /': async function (
        this: Schema,
        req: Req,
        res: Res,
        _next: Function
      ) {
        return WithAuth(req, res, 'votes.all')
      },
      'GET /:id': async function (
        this: Schema,
        req: Req,
        res: Res,
        _next: Function
      ) {
        return WithAuth(req, res, 'votes.get')
      },
    },
  },
];
