import { Server } from 'socket.io';
import methods from './methods';

import type { Service, ServiceSchema } from 'moleculer';
import type { DbServiceSettings } from 'moleculer-db';

interface SocketSettings extends DbServiceSettings {
  defaultName: string;
}

interface SocketLocalVars {
  myVar: string;
}

export type SocketThis = Service<SocketSettings> & SocketLocalVars;

const SocketService: ServiceSchema<SocketSettings> = {
  name: 'io',
  hooks: {},
  /**
   * Events
   */
  events: {},
  /**
   * Methods
   */
  methods: {
    ...methods,
  },
  /**
   * Service created lifecycle event handler
   */
  created(this: SocketThis) {
    this.io = new Server(this.broker.Server, {
      cors: {
        origin: '*',
      },
      transports: ['websocket', 'polling'],
    });
    this.io.on('connection', (socket: any) => {
      socket.on('disconnect', (reason: any) => {
        console.log('Client disconnected:', socket.id, reason);
      });
    });
  },

  /**
   * Service started lifecycle event handler
   */
  async started(this: SocketThis) {
    this.io.listen(4003);
    console.log('Socket.io server started on port 4003');
  },

  /**
   * Service stopped lifecycle event handler
   */
  async stopped(this: SocketThis) {
    console.log('Socket.io server stopped');
    this.io.close();
  },
};

export default SocketService;
