module.exports = {
  actions: {
    select: {
      rest: 'GET /select',
      async handler(ctx) {
        const {
          adapter: { client },
        } = this;
        const response = [];

        const cursor = client.db('wms').collection(ctx.service.name).find();

        // eslint-disable-next-line no-restricted-syntax
        for await (const doc of cursor) {
          response.push(doc);
        }

        return response;
      },
    },
  },
};
