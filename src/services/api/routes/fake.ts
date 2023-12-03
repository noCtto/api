import type { ServiceSchema } from 'moleculer';

import type { GatewayResponse, IncomingRequest } from 'moleculer-web';

export default [
  {
    path: '/fake',
    authentication: false,
    authorization: false,
    aliases: {
      'GET /': function (
        this: ServiceSchema,
        _req: IncomingRequest,
        res: GatewayResponse,
        _next: Function
      ) {

        // this.broker.call('fake.communities')
        // this.broker.call('fake.posts')
        
        // this.broker.call('fake.votes')
        // this.broker.call('fake.communitySubscribers')
        // this.broker.call('fake.userSubscribers')
        this.broker.call('fake.users')
        // this.broker.call('fake.subscribers')
        // this.broker.call('fake.replies')

        return res.end('OK');
      },
      'POST /': function (
        this: ServiceSchema,
        _req: IncomingRequest,
        res: GatewayResponse,
        _next: Function
      ) {
        return res.end('OK');
      },
      'PUT /': function (
        this: ServiceSchema,
        _req: IncomingRequest,
        res: GatewayResponse,
        _next: Function
      ) {
        return res.end('OK');
      },
      'DELETE /': function (
        this: ServiceSchema,
        _req: IncomingRequest,
        res: GatewayResponse,
        _next: Function
      ) {
        return res.end('OK');
      },
    },
  },
];
