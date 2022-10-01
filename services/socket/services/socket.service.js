const SocketIOService = require('moleculer-io');
// eslint-disable-next-line no-unused-vars

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
  hooks: {
    after: {
      // '*': () => {
      // console.log('Socket after', ctx, response);
      // },
      // broadcast(ctx, resp) {
      //   console.log('after broadcast');
      //   return resp;
      // },
    },
  },
  methods: {
    // broadcast: {
    //   handler(ctx) {},
    // },
    socketAuthorize(socket, handler) {
      console.log('Login using token:', socket.handshake.query.token);
      const accessToken = socket.handshake.query.token;
      if (accessToken) {
        if (
          accessToken ===
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTIwMjBiM2YyMzQ5YjU0NTAwZmViYyIsImV4cCI6MTY2MzMwNjIwODAwMCwiaWF0IjoxNjYzMzA2MjA4fQ.t9iE6tUesphmgDGZjKU3YAmCHZS86_w6PR0c4eFTMm0'
        ) {
          // valid credential
          return Promise.resolve({
            id: 1,
            detail: 'You are authorized using token.',
            name: 'John Doe',
          });
        }
        // invalid credentials
        return Promise.reject();
      }
      // anonymous user
      return Promise.resolve();
    },
  },
};
