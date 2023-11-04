import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function list(
  this: MicroService,
  _ctx: Context & { params: any }
) {

  _ctx.params.sort = { _id: -1, comments: -1 };
  _ctx.params.populate = ['votes'];

}
