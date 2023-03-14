import { Server } from 'socket.io';
import hooks from './hooks';
import methods from './methods';

export default {
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
    );
    this.io.on('connection', (socket) => {
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
