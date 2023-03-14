import type { ServiceSchema, Context } from "moleculer";
import type { 
  ApiSettingsSchema, 
  GatewayResponse, 
  IncomingRequest,
  Route,
  ApiRouteSchema,
} from "moleculer-web";

import OAuth2Server from '../../mixins/oauth2.mixin';
import ApiGateway from 'moleculer-web';

interface Meta {
	userAgent?: string | null | undefined;
	user?: object | null | undefined;
}

const ApiService: ServiceSchema<ApiSettingsSchema> = {
	name: "api",
	mixins: [ApiGateway, OAuth2Server],
	settings: {
		port: process.env.PORT != null ? Number(process.env.PORT) : 3000,
		ip: "0.0.0.0",
		use: [],
		routes: [
			{
				path: "/api",
				whitelist: ["**"],
				use: [],
				mergeParams: true,
				authentication: true,
				authorization: true,
				autoAliases: true,
				// aliases: {},
				onBeforeCall(
					ctx: Context<unknown, Meta>,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
				): void {
					ctx.meta.userAgent = req.headers["user-agent"];
				}, 
				onAfterCall(
					ctx: Context,
					route: Route,
					req: IncomingRequest,
					res: GatewayResponse,
					data: unknown,
				): unknown {
					return data;
				},
				callingOptions: {},
				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},
				mappingPolicy: "all",
				logging: true,
			},
      {
        path: "/status",
        whitelist: ["**"],
        authentication: false,
        authorization: false,
        autoAliases: true,
        aliases: {
          'GET /': function (this: ServiceSchema, req: IncomingRequest, res: GatewayResponse, next){
            console.log('THIS WAS CALLED', req);
            return res.end('OK');
          },
        },
      },
      {
        path: "/oauth",
        whitelist: ["**"],
        authentication: false,
        authorization: false,
        autoAliases: true,
        aliases: {},
        onBeforeCall(
          ctx: Context<unknown, Meta>,
          route: Route,
          req: IncomingRequest,
          res: GatewayResponse,
        ): void {
          ctx.meta.userAgent = req.headers["user-agent"];
        },
        onAfterCall(
          ctx: Context,
          route: Route,
          req: IncomingRequest,
          res: GatewayResponse,
          data: unknown,
        ): unknown {
          return data;
        }
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
		],
		log4XXResponses: false,
		assets: {
			folder: "public",
			options: {},
		},
	},

	methods: {
		// authenticate(
		// 	ctx: Context,
		// 	route: typeof Route,
		// 	req: typeof IncomingRequest,
		// ): Record<string, unknown> | null {
		// 	// Read the token from header
		// 	const auth = req.headers.authorization;
		// 	if (auth && auth.startsWith("Bearer")) {
		// 		const token = auth.slice(7);

		// 		// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
		// 		if (token === "123456") {
		// 			// Returns the resolved user. It will be set to the `ctx.meta.user`
		// 			return { id: 1, name: "John Doe" };
		// 		}
		// 		// Invalid token
		// 		throw new ApiGateway.Errors.UnAuthorizedError(
		// 			ApiGateway.Errors.ERR_INVALID_TOKEN,
		// 			null,
		// 		);
		// 	} else {
		// 		// No token. Throw an error or do nothing if anonymous access is allowed.
		// 		throw new ApiGateway.Errors.UnAuthorizedError(
		// 			ApiGateway.Errors.ERR_NO_TOKEN,
		// 			null,
		// 		);
		// 	}
		// },
		// authorize(ctx: Context<null, Meta>, route: Route, req: IncomingRequest) {
		// 	// Get the authenticated user.
		// 	const { user } = ctx.meta;

		// 	// It check the `auth` property in action schema.
		// 	if (req.$action.auth === "required" && !user) {
		// 		throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", null);
		// 	}
		// },
	},
};

export default ApiService;
