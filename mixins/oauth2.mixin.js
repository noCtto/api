const OAuth2Server = require('oauth2-server');

const { Request, Response } = OAuth2Server;

const MongoOAuth2 = require('../lib/oauth2');
const {
  func: { resp },
} = require('../utils');
require('dotenv').config();

function checkIfValidMD5Hash(str) {
  // Regular expression to check if string is a MD5 hash
  const regexExp = /^[a-f0-9]{40}$/gi;

  return regexExp.test(str);
}

module.exports = {
  settings: {
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 4 * 60 * 60, // 4hrs
    grants: ['refresh_token', 'client_credentials', 'password'],
  },
  methods: {
    accessToken(req, res, next) {
      const request = new Request(req);
      const response = new Response(res);

      return this.oauth
        .token(request, response)
        .then((token) => {
          resp(res, response.body, response.status, response.headers);
        })
        .catch((err) => {
          resp(res, err, 401);
        });
    },
    authenticate(req, res) {
      const request = new Request(req);
      const response = new Response(res);
      return this.oauth
        .authorize(request, response)
        .then((authorizationCode) => resp(res, response.body, response.status, response.headers))
        .catch((err) => resp(res, err, 401));
    },
    async authorize(ctx, route, req, res) {
      const request = new Request(req);
      const response = new Response(res);

      if (req.headers.authorization) {
        let jsonWebToken = null;

        const type = req.headers.authorization.split(' ')[0];
        if (type === 'Token' || type === 'Bearer')
          jsonWebToken = req.headers.authorization.split(' ')[1];

        if (jsonWebToken) {
          // Verify JWT token la expiracion es de 5 min
          if (checkIfValidMD5Hash(jsonWebToken)) {
            return this.oauth
              .authenticate(request, response)
              .then((token) => {
                ctx.meta.oauth = token;
                Object.assign(req, { oauth: token });
                return token;
              })
              .catch((err) => {
                // console.log('error en este');
                // ctx.meta.$statusCode = 401
                throw err;
                // throw new Error('Your session has expired');
              });
          }

          try {
            const userAuth = await ctx.call('users.resolveToken', {
              token: jsonWebToken,
            });
            // Aqui podria ir validacion de forzar a loguear
            if (userAuth) {
              ctx.meta.oauth = userAuth; // _.pick(userAuth, ["_id", "username", "email", "image"])
              ctx.meta.token = jsonWebToken;
              Object.assign(req, { oauth: userAuth });
              return jsonWebToken;
            }
          } catch (err) {
            throw Error('Token has expired, try login again');
          }
        }
      }

      return this.oauth.authenticate(request, response);
    },

    getAccessToken(bearerToken) {
      return this.db.token
        .findOne({ accessToken: bearerToken })
        .populate('user')
        .populate('client')
        .lean()
        .then((token) => token)
        .catch((err) => this.logger.error('[oAuth2Server] getAccessToken:', err));
    },
    getClient(clientId, clientSecret) {
      return this.db.client
        .findOne({ clientId, clientSecret })
        .populate('user')
        .lean()
        .then((client) => client)
        .catch((err) => this.logger.error('[oAuth2Server] getClient:', err));
    },
    getUser(username, password) {
      return this.db.user
        .findOne({ username, password }) // Encriptación
        .lean()
        .then((user) => user)
        .catch((err) => this.logger.error('[oAuth2Server] getUser:', err));
    },
    revokeToken(token) {
      return this.db.refreshToken
        .findOneAndRemove({ refreshToken: token.refreshToken })
        .then((removed) => !!removed)
        .catch((err) => this.logger.error('[oAuth2Server] revokeToken:', err));
    },
    saveToken(token, client, user) {
      return Promise.all([
        this.db.token.create({
          accessToken: token.accessToken,
          accessTokenExpiresAt: token.accessTokenExpiresAt,
          client: client._id,
          user: user._id,
          scope: token.scope,
        }),
        token.refreshToken
          ? this.db.refreshToken.create({
              // no refresh token for client_credentials
              refreshToken: token.refreshToken,
              refreshTokenExpiresAt: token.refreshTokenExpiresAt,
              client: client._id,
              user: user._id,
              scope: token.scope,
            })
          : Promise.resolve(),
      ])
        .then((promises) => {
          const accessToken = promises[0];
          const refreshToken = promises.length > 1 ? promises[1] : null;

          return { client, user, ...token, ...refreshToken };
        })
        .catch((err) => this.logger.error('[oAuth2Server] saveToken:', err));
    },
    getRefreshToken(refreshToken) {
      return this.db.refreshToken
        .findOne({ refreshToken })
        .populate('user')
        .populate('client')
        .lean()
        .then((dbToken) => {
          if (!dbToken) return false;

          const extendedClient = Object.assign(dbToken.client, {
            id: dbToken.client.clientId,
          });

          return Object.assign(dbToken, { client: extendedClient });
        })
        .catch((err) => this.logger.error('[oAuth2Server] getRefreshToken:', err));
    },
    validateScope(user, client, scope) {
      if (!scope) return true;

      if (
        String(user.scope)
          .split(',')
          .some((i) => i === scope) &&
        String(client.scope)
          .split(', ')
          .some((i) => i === scope)
      ) {
        return scope;
      }
    },
    getUserFromClient(client) {
      return this.db.user
        .findById(client.user)
        .lean()
        .then((dbUser) => dbUser)
        .catch((err) => this.logger.error('[oAuth2Server] getUserFromClient:', err));
    },
    getAuthorizationCode(authorizationCode) {
      return this.db.authorizationCode
        .findOne({ code: authorizationCode })
        .populate('user')
        .populate('client')
        .lean()
        .then((authCodeModel) => {
          if (!authCodeModel) return false;

          const extendedClient = Object.assign(authCodeModel.client, {
            id: authCodeModel.client.clientId,
          });

          return Object.assign(authCodeModel, {
            client: extendedClient,
          });
        })
        .catch((err) => this.logger.error('[oAuth2Server] getAuthorizationCode:', err));
    },
    saveAuthorizationCode(code, client, user) {
      return this.db.authorizationCode
        .create({
          expiresAt: code.expiresAt,
          client: client._id,
          code: code.authorizationCode,
          user: user._id,
          scope: code.scope,
        })
        .then(() => ({
          authorizationCode: code.authorizationCode,
          authorization_code: code.authorizationCode,
          expires_in: Math.floor((code.expiresAt - new Date()) / 1000),
        }))
        .catch((err) => this.logger.error('[oAuth2Server] saveAuthorizationCode:', err));
    },
    revokeAuthorizationCode(code) {
      return this.db.authAuthorizationCode
        .findOneAndRemove({ code: code.code })
        .then((removed) => !!removed)
        .catch((err) => this.logger.error('[oAuth2Server] revokeAuthorizationCode:', err));
    },
  },
  async created() {
    const { MONGO_URI } = process.env;

    const { connection, db } = await MongoOAuth2(`${MONGO_URI}/oauth2`);

    this.connection = connection;
    this.db = db;

    this.logger.info('[oAuth2Server] Server has created successfully.');
  },
  async started() {
    this.oauth = new OAuth2Server({
      ...this.settings,
      model: {
        getAccessToken: this.getAccessToken,
        getClient: this.getClient,
        getRefreshToken: this.getRefreshToken,
        getUser: this.getUser,
        revokeToken: this.revokeToken,
        saveToken: this.saveToken,
        validateScope: this.validateScope,
        getAuthorizationCode: this.getAuthorizationCode,
        generateRefreshToken: this.generateRefreshToken,
        getUserFromClient: this.getUserFromClient,
        saveAuthorizationCode: this.saveAuthorizationCode,
        revokeAuthorizationCode: this.revokeAuthorizationCode,
        // generateAuthorizationCode: (client, user, scope) => console.log('generateAuthorizationCode'), // * Optional
        // verifyScope: (accessToken, scope) => console.log('verifyScope'), // * Optional
      },
    });

    this.logger.info('[oAuth2Server] Server has connected successfully.');
  },
  async stopped() {
    await this.connection.disconnect();
    delete this.connection;
    delete this.oauth;
    delete this.db;

    this.logger.info('[oAuth2Server] Server has disconnected.');
  },
};
