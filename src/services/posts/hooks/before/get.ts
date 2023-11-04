import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function get(
  this: MicroService,
  ctx: Context & { params: any }
) {
  console.log('posts.hooks.before.get', ctx.params )
  ctx.params.populate = ['votes', 'community', 'author'];
}
