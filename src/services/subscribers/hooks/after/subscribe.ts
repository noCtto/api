import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';

export default function vote(this: MicroService, _ctx: Context, response: any) {
  this.logger.debug('subscribers.hooks.after', _ctx.params );
  // ctx.call('io.broadcast', {
  //   namespace: '/',
  //   event: `update_votes_count`,
  //   args: [
  //     {
  //       ...response,
  //     },
  //   ],
  // });
  // return response;
  return response;
}
