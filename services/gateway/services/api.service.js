/* eslint-disable consistent-return */
const compression = require('compression');
const ApiGateway = require('moleculer-web');
const OAuth2Server = require('../../../mixins/oauth2.mixin');

const {
  func: { resp },
} = require('../../../utils');

module.exports = {
  name: 'api',
  mixins: [ApiGateway, OAuth2Server],
  use: [compression()],
  settings: {
    port: process.env.PORT || 4000,
    cors: {
      origin: '*',
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      credentials: false,
      maxAge: 3600,
    },
    routes: [
      {
        path: '/',
        authorization: true, // ? Enable oauth2
        autoAliases: true,
        bodyParsers: {
          json: { limit: '2MB' },
          urlencoded: { extended: true, limit: '2MB' },
        },
        aliases: {
          'GET /': 'posts.list',
        },
        onBeforeCall(ctx, route, req, res) {
          return this.authorize(ctx, route, req, res);
        },
      },
      {
        path: '/status',
        aliases: {
          'GET /': function status(req, res) {
            const { node, log } = req.query;
            let nodeId = null;
            if (node === 'all') nodeId = null;
            else if (node) nodeId = node;

            return this.broker
              .ping(nodeId)
              .then((response) =>
                resp(
                  res,
                  {
                    ...(log && response),
                    code: 200,
                    message: 'Service OK',
                  },
                  200
                )
              )
              .catch((err) => resp(res, err, 400));
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
        path: '/oauth/token',
        aliases: {
          'POST /': function token(req, res, next) {
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
          'POST /': function auth(req, res, next) {
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
      {
        path: '/me',
        authorization: false,
        bodyParsers: {
          json: false,
          urlencoded: false,
        },
        busboyConfig: {
          limits: {
            files: 3,
          },
        },
        aliases: {
          'GET /': 'users.me',
          onBeforeCall(ctx, route, req, res) {
            console.log('CTX', ctx.meta);
          },
        },
      },
      {
        path: '/c',
        authorization: true,
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true,
          },
        },
        aliases: {
          'GET /': 'comments.list',
          'GET /:id': 'comments.get',
          'POST /': 'comments.create',
        },
      },
      {
        path: '/v',
        authorization: true,
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true,
          },
        },
        aliases: {
          'GET /': 'votes.list',
          'GET /:id': 'votes.get',
          'PUT /': 'votes.vote',
        },
      },
      {
        path: '/t',
        authorization: true,
        bodyParsers: {
          json: false,
          urlencoded: false,
        },
        busboyConfig: {
          limits: {
            files: 3,
          },
        },
        aliases: {
          'GET /': 'threads.list',
          'GET /:id': 'threads.get',
        },
      },
      {
        path: '/p',
        authorization: false,
        bodyParsers: {
          json: true,
          urlencoded: true,
        },
        aliases: {
          'GET /': 'posts.list',
          'GET /:id': 'posts.get',
        },
        onBeforeCall(ctx, route, req, res) {
          const { authorization } = req.headers;
          if (authorization) {
            return this.authorize(ctx, route, req, res);
          }
        },
      },
      {
        path: '/p/create',
        authorization: true,
        bodyParsers: {
          json: true,
          urlencoded: true,
        },
        aliases: {
          'POST /': 'posts.create',
        },
      },
      {
        path: '/all',
        authorization: false,
        aliases: {
          'GET /': 'posts.all',
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true,
          },
        },
        onBeforeCall(ctx, route, req, res) {
          const { authorization } = req.headers;
          if (authorization) {
            return this.authorize(ctx, route, req, res);
          }
        },
      },
      {
        path: '/u',
        authorization: false,
        bodyParsers: {
          json: false,
          urlencoded: false,
        },
        busboyConfig: {
          limits: {
            files: 3,
          },
        },
        aliases: {
          'GET /': 'users.list',
          'GET /:id': 'users.get',
        },
      },
      {
        path: '/upload',
        authorization: true,
        bodyParsers: {
          json: false,
          urlencoded: false,
        },
        busboyConfig: {
          limits: {
            files: 3,
          },
        },
        aliases: {
          'POST /': 'multipart:posts.upload',
        },
        mappingPolicy: 'restrict',
        onBeforeCall(ctx, route, req) {
          if (!ctx.meta) ctx.meta = {};
          ctx.meta.params = ctx.meta.$multipart;
          ctx.params = ctx.meta.$multipart;
          req.params = ctx.meta.$multipart;
        },
      },
      {
        path: '/login',
        authorization: false,
        aliases: {
          'POST /': 'users.login',
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true,
          },
        },
      },
      {
        path: '/register',
        authorization: false,
        aliases: {
          'POST /': 'users.register',
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true,
          },
        },
      },
      {
        path: '/logout',
        authorization: true,
        aliases: {
          'POST /': 'users.logout',
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true,
          },
        },
      },
      {
        path: '/force-logout',
        authorization: false,
        aliases: {
          'POST /': 'users.forceLogout',
        },
        bodyParsers: {
          json: true,
          urlencoded: {
            extended: true,
          },
        },
      },
      {
        path: '/docs',
        authorization: false,
        aliases: {
          'GET /json': 'docs.generateDocs',
          'GET /': 'docs.ui',
        },
      },
      {
        path: '/openapi',
        authorization: false,
        aliases: {
          'GET /json': 'openapi.generateDocs',
          'GET /': 'openapi.ui',
        },
      },
    ],
    assets: {
      folder: '../items/public',
    },
  },
};
