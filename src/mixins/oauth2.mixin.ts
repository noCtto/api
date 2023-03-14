import OAuth2Server from 'oauth2-server';
import { ServiceSchema, Service } from 'moleculer';

import MongoOAuth2 from '../lib/oauth2';

// import { resp } from '../utils/func';

const { Request, Response } = OAuth2Server;

function checkIfValidMD5Hash(str: string) {
  const regexExp = /^[a-f0-9]{40}$/gi;
  return regexExp.test(str);
};

type OAuth2Methods = {
  accessToken: (req: any, res: any, next: any) => Promise<any>;
  authenticate: (req: any, res: any) => Promise<any>;
  authorize: (ctx: any, route: any, req: any, res: any) => Promise<any>;
  token: (req: any, res: any, next: any) => Promise<any>;
  getAccessToken: (accessToken: string) => Promise<any>;
  getClient: (clientId: string, clientSecret: string) => Promise<any>;
  getUser: (username: string, password: string) => Promise<any>;
  saveToken: (token: any, client: any, user: any) => Promise<any>;
  verifyScope: (token: any, scope: any) => Promise<any>;
  getAuthorizationCode: (authorizationCode: string) => Promise<any>;
};

type Oauth2ServiceSchema = Partial<ServiceSchema>

export type OAuth2This = Service & OAuth2Methods;

export default function createOauth2Mixin(): Oauth2ServiceSchema {
  
  const schema: Oauth2ServiceSchema = {
  settings: {
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 4 * 60 * 60, // 4hrs
    grants: ['refresh_token', 'client_credentials', 'password'],
  },
  mixins: [MongoOAuth2],
  events: {},
  methods: {
    async accessToken(this:OAuth2This, req: any, res: any, next: any) {
      const request = new Request(req);
      const response = new Response(res);

      return this.oauth
        .token(request, response)
        .then((token:string) => {
          // resp(res, response.body, response.status, response.headers);
          return token;
        })
        .catch((err:any) => {
          // resp(res, err, 401);
          return err;
        });
    },
    async authenticate(this:OAuth2This, req: any, res: any) {
      const request = new Request(req);
      const response = new Response(res);
      return this.oauth
        .authorize(request, response)
        .then((authorizationCode:string) => {
          // resp(res, response.body, response.status, response.headers);
          return authorizationCode;
        })
        .catch((err:any) => {
          // resp(res, err, 401);
          return err;
        });
    },
    async authorize(this:OAuth2This, ctx: any, route: any, req: any, res: any) {
      console.log('Authorizing...');
      const request = new Request(req);
      const response = new Response(res);
      return this.oauth
        .authorize(request, response)
        .then((authorizationCode:string) => {
          // resp(res, response.body, response.status, response.headers);
          return authorizationCode;
        })
        .catch((err:any) => {
          // resp(res, err, 401);
          return err;
        });
    },
    async token(this:OAuth2This, req: any, res: any, next: any) {
      const request = new Request(req);
      const response = new Response(res);
      return this.oauth
        .token(request, response)
        .then((token:string) => {
          // resp(res, response.body, response.status, response.headers);
          return token;
        })
        .catch((err:any) => {
          // resp(res, err, 401);
          return err;
        });
    },
    async getAccessToken(this:OAuth2This, accessToken: string) {
      return this.adapter.getAccessToken(accessToken);
    },
    async getClient(this:OAuth2This, clientId: string, clientSecret: string) {
      return this.adapter.getClient(clientId, clientSecret);
    },
    async getUser(this:OAuth2This, username: string, password: string) {
      return this.adapter.getUser(username, password);
    },
    async saveToken(this:OAuth2This, token: any, client: any, user: any) {
      return this.adapter.saveToken(token, client, user);
    },
    async verifyScope(this:OAuth2This, token: any, scope: any) {
      return this.adapter.verifyScope(token, scope);
    },
    async getAuthorizationCode(this:OAuth2This, authorizationCode: string) {
      return this.adapter.getAuthorizationCode(authorizationCode);
    },
  }
}
return schema;
}

// export default {
//   settings: {
//     allowBearerTokensInQueryString: true,
//     accessTokenLifetime: 4 * 60 * 60, // 4hrs
//     grants: ['refresh_token', 'client_credentials', 'password'],
//   },
//   methods: {
//     accessToken: (req, res, next) {
//       const request = new Request(req);
//       const response = new Response(res);

//       return this.oauth
//         .token(request, response)
//         .then((token) => {
//           resp(res, response.body, response.status, response.headers);
//         })
//         .catch((err) => {
//           resp(res, err, 401);
//         });
//     },
//     authenticate(req, res) {
//       const request = new Request(req);
//       const response = new Response(res);
//       return this.oauth
//         .authorize(request, response)
//         .then((authorizationCode) => resp(res, response.body, response.status, response.headers))
//         .catch((err) => resp(res, err, 401));
//     },
//     async authorize(ctx, route, req, res) {
//       console.log('Authorizing...');
//       const request = new Request(req);
//       const response = new Response(res);

//       const { headers } = req;

//       if (headers.authorization) {
//         const { authorization } = headers;

//         // const type = authorization.split(' ')[0];
//         const token = authorization.split(' ')[1];

//         if (token) {
//           if (token === 'Stranger') {
//             return;
//           }

//           if (checkIfValidMD5Hash(token)) {
//             return this.oauth
//               .authenticate(request, response)
//               .then((tok) => {
//                 ctx.meta.oauth = tok;
//                 Object.assign(req, { oauth: tok });
//                 return tok;
//               })
//               .catch((err) => {
//                 throw err;
//               });
//           }
//           try {
//             const userAuth = await ctx.call('users.resolveToken', {
//               token,
//             });
//             // Aqui podria ir validacion de forzar a loguear
//             if (userAuth) {
//               ctx.meta.oauth = userAuth; // _.pick(userAuth, ["_id", "username", "email", "image"])
//               ctx.meta.token = token;
//               Object.assign(req, { oauth: userAuth });
//               return token;
//             }
//           } catch (err) {
//             throw Error('Token has expired, try login again');
//           }
//           console.log('THIS IS NOT A VALID TOKEN', token);
//         }
//       }
//       return this.oauth.authenticate(request, response);
//     },

//     getAccessToken(bearerToken) {
//       return this.db.token
//         .findOne({ accessToken: bearerToken })
//         .populate('user')
//         .populate('client')
//         .lean()
//         .then((token) => token)
//         .catch((err) => this.logger.error('[oAuth2Server] getAccessToken:', err));
//     },
//     getClient(clientId, clientSecret) {
//       return this.db.client
//         .findOne({ clientId, clientSecret })
//         .populate('user')
//         .lean()
//         .then((client) => client)
//         .catch((err) => this.logger.error('[oAuth2Server] getClient:', err));
//     },
//     getUser(username, password) {
//       return this.db.user
//         .findOne({ username, password }) // Encriptación
//         .lean()
//         .then((user) => user)
//         .catch((err) => this.logger.error('[oAuth2Server] getUser:', err));
//     },
//     revokeToken(token) {
//       return this.db.refreshToken
//         .findOneAndRemove({ refreshToken: token.refreshToken })
//         .then((removed) => !!removed)
//         .catch((err) => this.logger.error('[oAuth2Server] revokeToken:', err));
//     },
//     saveToken(token, client, user) {
//       return Promise.all([
//         this.db.token.create({
//           accessToken: token.accessToken,
//           accessTokenExpiresAt: token.accessTokenExpiresAt,
//           client: client._id,
//           user: user._id,
//           scope: token.scope,
//         }),
//         token.refreshToken
//           ? this.db.refreshToken.create({
//               // no refresh token for client_credentials
//               refreshToken: token.refreshToken,
//               refreshTokenExpiresAt: token.refreshTokenExpiresAt,
//               client: client._id,
//               user: user._id,
//               scope: token.scope,
//             })
//           : Promise.resolve(),
//       ])
//         .then((promises) => {
//           const accessToken = promises[0];
//           const refreshToken = promises.length > 1 ? promises[1] : null;

//           return { client, user, ...token, ...refreshToken };
//         })
//         .catch((err) => this.logger.error('[oAuth2Server] saveToken:', err));
//     },
//     getRefreshToken(refreshToken) {
//       return this.db.refreshToken
//         .findOne({ refreshToken })
//         .populate('user')
//         .populate('client')
//         .lean()
//         .then((dbToken) => {
//           if (!dbToken) return false;

//           const extendedClient = Object.assign(dbToken.client, {
//             id: dbToken.client.clientId,
//           });

//           return Object.assign(dbToken, { client: extendedClient });
//         })
//         .catch((err) => this.logger.error('[oAuth2Server] getRefreshToken:', err));
//     },
//     validateScope(user, client, scope) {
//       if (!scope) return true;

//       if (
//         String(user.scope)
//           .split(',')
//           .some((i) => i === scope) &&
//         String(client.scope)
//           .split(', ')
//           .some((i) => i === scope)
//       ) {
//         return scope;
//       }
//     },
//     getUserFromClient(client) {
//       return this.db.user
//         .findById(client.user)
//         .lean()
//         .then((dbUser) => dbUser)
//         .catch((err) => this.logger.error('[oAuth2Server] getUserFromClient:', err));
//     },
//     getAuthorizationCode(authorizationCode) {
//       return this.db.authorizationCode
//         .findOne({ code: authorizationCode })
//         .populate('user')
//         .populate('client')
//         .lean()
//         .then((authCodeModel) => {
//           if (!authCodeModel) return false;

//           const extendedClient = Object.assign(authCodeModel.client, {
//             id: authCodeModel.client.clientId,
//           });

//           return Object.assign(authCodeModel, {
//             client: extendedClient,
//           });
//         })
//         .catch((err) => this.logger.error('[oAuth2Server] getAuthorizationCode:', err));
//     },
//     saveAuthorizationCode(code, client, user) {
//       return this.db.authorizationCode
//         .create({
//           expiresAt: code.expiresAt,
//           client: client._id,
//           code: code.authorizationCode,
//           user: user._id,
//           scope: code.scope,
//         })
//         .then(() => ({
//           authorizationCode: code.authorizationCode,
//           authorization_code: code.authorizationCode,
//           // expires_in: Math.floor(( code.expiresAt - new Date()) / 1000),
//         }))
//         .catch((err) => this.logger.error('[oAuth2Server] saveAuthorizationCode:', err));
//     },
//     revokeAuthorizationCode(code) {
//       return this.db.authAuthorizationCode
//         .findOneAndRemove({ code: code.code })
//         .then((removed) => !!removed)
//         .catch((err) => this.logger.error('[oAuth2Server] revokeAuthorizationCode:', err));
//     },
//   },
//   async created() {
//     const { MONGO_URI } = process.env;

//     const { connection, db } = await MongoOAuth2(`${MONGO_URI}/oauth2`);

//     this.connection = connection;
//     this.db = db;

//     this.logger.info('[oAuth2Server] Server has created successfully.');
//   },
//   async started() {
//     this.oauth = new OAuth2Server({
//       ...this.settings,
//       model: {
//         getAccessToken: this.getAccessToken,
//         getClient: this.getClient,
//         getRefreshToken: this.getRefreshToken,
//         getUser: this.getUser,
//         revokeToken: this.revokeToken,
//         saveToken: this.saveToken,
//         validateScope: this.validateScope,
//         getAuthorizationCode: this.getAuthorizationCode,
//         generateRefreshToken: this.generateRefreshToken,
//         getUserFromClient: this.getUserFromClient,
//         saveAuthorizationCode: this.saveAuthorizationCode,
//         revokeAuthorizationCode: this.revokeAuthorizationCode,
//         // generateAuthorizationCode: (client, user, scope) => console.log('generateAuthorizationCode'), // * Optional
//         // verifyScope: (accessToken, scope) => console.log('verifyScope'), // * Optional
//       },
//     });

//     this.logger.info('[oAuth2Server] Server has connected successfully.');
//   },
//   async stopped() {
//     await this.connection.disconnect();
//     delete this.connection;
//     delete this.oauth;
//     delete this.db;

//     this.logger.info('[oAuth2Server] Server has disconnected.');
//   },
// };
