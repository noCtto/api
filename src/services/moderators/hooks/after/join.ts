import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';

export default function join(this: MicroService, _ctx: Context, response: any) {
  this.logger.debug('moderators.hooks.after', _ctx.params );
  return response;
}
