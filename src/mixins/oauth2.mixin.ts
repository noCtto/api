import OAuth2Server from 'oauth2-server';
import { ServiceSchema } from 'moleculer';
import { Context } from 'moleculer';
import MongoOAuth2 from '../lib/oauth2';
import type { GatewayResponse, IncomingRequest, Route } from 'moleculer-web';

const { Request, Response } = OAuth2Server;
interface Meta {
  userAgent?: string | null | undefined;
  user?: object | null | undefined;
}

export type OAuth2Methods = {
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

export type Oauth2ServiceSchema = Partial<ServiceSchema> &
  Partial<OAuth2Methods>;

export type OAuth2This = Oauth2ServiceSchema & OAuth2Methods;

export default function createOauth2ServiceMixin(): Oauth2ServiceSchema {
  const schema: Oauth2ServiceSchema = {
    settings: {
      allowBearerTokensInQueryString: true,
      accessTokenLifetime: 4 * 60 * 60, // 4hrs
      grants: ['refresh_token', 'client_credentials', 'password'],
    },
    events: {},
    methods: {
      accessToken(req: any, res: any, next: any) {
        const request = new Request(req);
        const response = new Response(res);
        console.log('Access Token');
        try {
          return this.oauth.token(request, response).then((_token: any) => {
            response.headers = {
              ...response.headers,
              'Content-Type': 'application/json charset=utf-8',
            };
            for (const h in response.headers)
              res.setHeader(h, response.headers[h]);
            res.writeHead(response.status);
            res.end(JSON.stringify(response.body));
          });
        } catch (err) {
          next(err);
        }
      },
      authenticate(
        _ctx: Context<null, Meta>,
        _route: Route,
        req: IncomingRequest,
        res: GatewayResponse,
        next: any
      ) {
        console.log('Authenticate');
        const request = new Request(req);
        const response = new Response(res);
        try {
          return this.oauth
            .authenticate(request, response)
            .then((token: any) => {
              // console.log('Authenticating', token)
              // resp(res, response.body, response.status, response.headers);
              return token;
            });
        } catch (err) {
          console.log('Authenticating error', err);
          return next(err);
        }
      },
      async authorize(
        _ctx: Context<null, Meta>,
        _route: Route,
        req: IncomingRequest,
        res: GatewayResponse,
        _next: any
      ) {
        console.log('AUTHORIZE');
        const request = new Request(req);
        const response = new Response(res);
        try {
          return this.oauth.authorize(request, response).then((token: any) => {
            console.log('Authorizing', token);
            // resp(res, response.body, response.status, response.headers);
            return token;
          });
        } catch (err) {
          console.log('Authorizing error', err);
          // resp(res, response.body, response.status, response.headers);
        }
      },
      async getAccessToken(accessToken: string) {
        const token = await this.db.token
          .findOne({ accessToken })
          .populate('user')
          .populate('client');
        return token;
      },
      async getClient(clientId: string, clientSecret: string) {
        const client = this.db.client
          .findOne({ clientId, clientSecret })
          .populate('user')
          .lean()
          .then((client: any) => client)
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] getClient:', err)
          );
        return client;
      },
      async getUser(username: string, password: string) {
        const user = await this.db.user
          .findOne({ username, password }) // Encriptación
          .lean()
          .then((user: any) => user)
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] getUser:', err)
          );
        return user;
      },
      revokeToken(token) {
        return this.db.refreshToken
          .findOneAndRemove({ refreshToken: token.refreshToken })
          .then((removed: any) => !!removed)
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] revokeToken:', err)
          );
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
            // const accessToken = promises[0];
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
          .then((dbToken: any) => {
            if (!dbToken) return false;

            const extendedClient = Object.assign(dbToken.client, {
              id: dbToken.client.clientId,
            });

            return Object.assign(dbToken, { client: extendedClient });
          })
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] getRefreshToken:', err)
          );
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
          .then((dbUser: any) => dbUser)
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] getUserFromClient:', err)
          );
      },
      getAuthorizationCode(authorizationCode) {
        return this.db.authorizationCode
          .findOne({ code: authorizationCode })
          .populate('user')
          .populate('client')
          .lean()
          .then((authCodeModel: any) => {
            if (!authCodeModel) return false;

            const extendedClient = Object.assign(authCodeModel.client, {
              id: authCodeModel.client.clientId,
            });

            return Object.assign(authCodeModel, {
              client: extendedClient,
            });
          })
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] getAuthorizationCode:', err)
          );
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
            // expires_in: Math.floor(( code.expiresAt - new Date()) / 1000),
          }))
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] saveAuthorizationCode:', err)
          );
      },
      revokeAuthorizationCode(code) {
        return this.db.authAuthorizationCode
          .findOneAndRemove({ code: code.code })
          .then((removed: any) => !!removed)
          .catch((err: any) =>
            this.logger.error('[oAuth2Server] revokeAuthorizationCode:', err)
          );
      },
      verifyScope(token, scope) {
        return token.scope === scope;
      },
    },
    async created() {
      console.log('Oauth2 service connected to db');
      const { connection, db } = await MongoOAuth2(
        `${process.env.MONGO_URI}/oauth2`
      );
      this.connection = connection;
      this.db = db;
      this.logger.info('[oAuth2Server] Server has created successfully.');
    },
    async started() {
      console.log('Oauth2 service started');
      this.oauth = new OAuth2Server({
        model: {
          getAccessToken: this.getAccessToken as any,
          getClient: this.getClient as any,
          getUser: this.getUser as any,
          saveToken: this.saveToken as any,
          verifyScope: this.verifyScope as any,
          getAuthorizationCode: this.getAuthorizationCode as any,
          saveAuthorizationCode: this.saveAuthorizationCode as any,
          revokeAuthorizationCode: this.revokeAuthorizationCode as any,
          getRefreshToken: this.getRefreshToken as any,
          revokeToken: this.revokeToken as any,
          validateScope: this.validateScope as any,
          getUserFromClient: this.getUserFromClient as any,
        },
      });
      console.log('Oauth2 server created');
    },
  };
  return schema;
}
