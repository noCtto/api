import type { ServiceSchema } from "moleculer";
import type { 
  ApiSettingsSchema, 
} from "moleculer-web";

import OAuth2Server from '../../mixins/oauth2.mixin';
import ApiGateway from 'moleculer-web';
import routes from './routes';

type ApiServiceSchema = ServiceSchema<ApiSettingsSchema>;

const ApiService: ApiServiceSchema= {
	name: "api",
	mixins: [ApiGateway, OAuth2Server()],
	settings: {
		port: process.env.PORT != null ? Number(process.env.PORT) : 3000,
		ip: "0.0.0.0",
		use: [],
    cors: {
      origin: '*',
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: [],
      exposedHeaders: [],
      credentials: false,
      maxAge: 3600,
    },
		routes,
		assets: {
			folder: "public",
			options: {},
		},
	},
};

export default ApiService;
