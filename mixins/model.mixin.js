const origins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  'https://beta-wms.g-global.io',
  'https://beta-wms.g-global.dev',
  'https://beta-wms.g-global.com',
];

module.exports = {
  actions: {
    model: {
      rest: 'GET /model',
      cors: {
        origin: origins,
        methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Access-Control-Allow-Credentials', 'Authorization'],
        exposedHeaders: [],
        credentials: true,
        maxAge: 3600,
      },
      async handler(ctx) {
        const { key, value, table } = ctx.params;
        const {
          adapter: { client },
        } = this;
        const response = [];

        const cursor = client
          .db('nocheto')
          .collection(ctx.service.name)
          .find({
            [key]: {
              $regex: new RegExp(value.toLowerCase(), 'i'),
            },
            active: true,
            table,
          });

        // eslint-disable-next-line no-restricted-syntax
        for await (const doc of cursor) {
          response.push(doc);
        }

        return response;
      },
    },
    select: {
      rest: 'GET /select',
      cors: {
        origin: origins,
        methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Access-Control-Allow-Credentials', 'Authorization'],
        exposedHeaders: [],
        credentials: true,
        maxAge: 3600,
      },
      async handler(ctx) {
        const { table } = ctx.params;
        const {
          adapter: { client },
        } = this;
        const response = [];

        const cursor = client
          .db('nocheto')
          .collection(ctx.service.name)
          .find(table ? { table, active: true } : { active: true });

        // eslint-disable-next-line no-restricted-syntax
        for await (const doc of cursor) {
          response.push(doc);
        }

        return response;
      },
    },
  },
};
