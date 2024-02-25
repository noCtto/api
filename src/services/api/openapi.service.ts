import OpenApiMixin  from "moleculer-auto-openapi";
import type { ServiceSchema } from 'moleculer';
import type { ApiSettingsSchema } from 'moleculer-web';

type ApiServiceSchema = ServiceSchema<ApiSettingsSchema>;

const ApiService: ApiServiceSchema = {
  name: "openapi",
  mixins: [OpenApiMixin],
  settings: {
     openapi: {
        info: {
           description: "Foo",
           title: "WRDZ.api",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                  scheme: "bearer",
                  type: "http",
                },
            },
          },
        },
     },
  };

export default ApiService;
