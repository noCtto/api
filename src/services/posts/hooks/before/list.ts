import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function list(
  this: MicroService,
  _ctx: Context & { params: any }
) {
  // ctx.params.sort = { _id: -1, comments: -1 };
  console.log('list hook');
}
