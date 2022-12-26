/* eslint-disable consistent-return */
const compression = require('compression');
const ApiGateway = require('moleculer-web');
const OAuth2Server = require('../../../mixins/oauth2.mixin');
const { checkIfValidMD5Hash } = require('../../../utils/func');

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
        that: true,
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
          if (req.headers && req.headers.authorization) {
            if (
              req.headers.authorization.includes('Bearer') &&
              req.headers.authorization.length <= 48
            ) {
              if (
                req?.$action?.name &&
                [
                  // 'shipping-orders.create', Protect Routes in API
                ].includes(req.$action.name)
              ) {
                return resp(
                  res,
                  {
                    code: 401,
                    message: 'This service is disabled, please read the developer documentation.',
                    documentationLink: 'https://localhost:4000/wms/v2/docs',
                  },
                  401
                );
              }
            }
            const jsonWebToken =
              req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!checkIfValidMD5Hash(jsonWebToken)) {
              // Solo en estos casos no se valida la session, no es necesario
              if (req.url === '/sessions/fetch-session' || req.url === '/users/update-token')
                return null;

              ctx
                .call('users.resolveToken', {
                  token: jsonWebToken,
                })
                .then((response) => {
                  this.logger.info('Se busca session, validar para actualizar el token');
                  ctx
                    .call('sessions.find', { query: { user: response.id }, sort: '-createdAt' })
                    .then(([session]) => {
                      this.logger.info('Se buscan sessiones', response.id);
                      if (!session) return;
                      this.logger.info('Se buscan sessiones');
                      const now = new Date();
                      const updateTime = new Date(Date.parse(session.expires) - 5 * 60 * 1000);
                      const expires = new Date(session.expires);

                      if (now >= updateTime && now <= expires) {
                        this.logger.info('Se actualiza el token 5 min antes de que expire');
                        ctx
                          .call('users.updateToken', {
                            userId: response.id,
                          })
                          .then(() => {
                            this.logger.info('Se actualizo el token');
                          });
                      }
                      this.logger.info('No Se actualizo el token');
                    })
                    .catch((err) => this.logger.error(err));
                  // return response;
                });
            }
          }
        },
        // aliases: {
        //   'GET /': function base(req, res) {
        //     res.send('HEy Yo');
        //   },
        // },
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
