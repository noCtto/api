// import { Server } from 'socket.io';
import methods from './methods';

import type { Service, ServiceSchema } from 'moleculer';
import type { DbServiceSettings } from 'moleculer-db';

interface SocketSettings extends DbServiceSettings {
  defaultName: string;
  created?: Function;
  started?: Function;
  stopped?: Function
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
  // created(this: SocketThis) {
  //   this.io = new Server(this.broker.Server, {
  //     cors: {
  //       origin: '*',
  //     },
  //     transports: ['websocket', 'polling'],
  //   });
  //   this.io.on('connection', (socket: any) => {
  //     socket.on('disconnect', (reason: any) => {
  //       this.logger.info('Client disconnected:', socket.id, reason);
  //     });
  //   });
  // },

  // /**
  //  * Service started lifecycle event handler
  //  */
  // async started(this: SocketThis) {
  //   this.io.listen(4003);
  //   this.logger.info('Socket.io server started on port 4003');
  // },

  // /**
  //  * Service stopped lifecycle event handler
  //  */
  // async stopped(this: SocketThis) {
  //   this.logger.info('Socket.io server stopped');
  //   this.io.close();
  // },
};

export default SocketService;
