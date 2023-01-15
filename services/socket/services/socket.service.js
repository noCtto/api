// eslint-disable-next-line no-unused-vars
// const SocketIOService = require('moleculer-io');
const { Server } = require('socket.io');
const hooks = require('../hooks');
const methods = require('../methods');

module.exports = {
  name: 'io',
  created() {
    this.io = new Server(
      this.broker.Server,
      {
        cors: {
          origin: '*',
        },
        transports: ['websocket', 'polling'],
      },
      {
        path: '/socket.io',
      }
    );
    this.io.on('connection', (socket) => {
      // Handle socket connection
      console.log('Client connected:', socket.id);
      // Register event handlers
      socket.on('custom-event', (data) => {
        console.log('Received data:', data);
      });
      socket.on('disconnect', (reason) => {
        console.log('Client disconnected:', socket.id, reason);
      });
    });
  },
  started() {
    this.io.listen(4003);
    console.log('Socket.io server started on port 4003');
  },
  stopped() {
    console.log('Socket.io server stopped');
    this.io.close();
  },
  actions: {
    broadcast: {
      params: {
        namespace: 'string',
        event: 'string',
        args: 'array|obj',
      },
      handler(ctx) {
        this.io.emit(ctx.params.event, ctx.params.args);
      },
    },
  },
  methods,
  hooks,
};
