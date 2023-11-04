import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function get(
  this: MicroService,
  ctx: Context & { params: any }
) {
  console.log('comments.hooks.before.get', ctx.params)
  ctx.params.populate = ['author', 'votes'];
  
  
  console.log('comments.hooks.before.get', ctx.params)
}
