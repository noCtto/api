import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';

export default function voted(this: MicroService, _ctx: Context, response: any) {
  this.logger.debug('voters.hooks.after.voted', _ctx.params );
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
