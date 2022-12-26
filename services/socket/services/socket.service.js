// eslint-disable-next-line no-unused-vars
const SocketIOService = require('moleculer-io');
const hooks = require('../hooks');
const methods = require('../methods');

module.exports = {
  name: 'io',
  mixins: [SocketIOService],
  settings: {
    port: 4003,
    io: {
      options: {
        // adapter: redisAdapter({ host: 'localhost', port: 6379 })
      },
      namespaces: {
        '/': {
          authorization: true,
          middlewares: [
            function (socket, next) {
              console.log('namespace middleware'); // point to service instance.
              next();
            },
          ],
          // packetMiddlewares:[],
          events: {
            call: {
              whitelist: ['math.*', 'say.*', 'accounts.*', 'rooms.*', 'io.*'],
              async onBeforeCall(ctx, socket, action, params, callOptions) {
                console.log('before hook:', { action, params, callOptions });
              },
              async onAfterCall(ctx, socket, res) {
                console.log('after hook', res);
              },
              // callOptions:{}
            },
          },
        },
      },
    },
  },
  hooks,
  methods,
};
