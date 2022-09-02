const Openapi = require('moleculer-auto-openapi');

module.exports = {
  name: 'openapi',
  mixins: [Openapi],
  settings: {
    schemaPath: '/openapi/json',
    uiPath: '/openapi',
    openapi: {
      info: {
        description: 'Microservices',
        title: 'API Documentation',
        version: '0.0.1',
      },
      tags: [
        // you tags
        { name: 'auth', description: 'auth tag' },
      ],
      components: {
        // you auth
        securitySchemes: {
          myBasicAuth: {
            type: 'http',
            scheme: 'basic',
          },
        },
      },
    },
  },
};
