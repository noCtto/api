import type { MicroService } from '../../../../lib/microservice';
import type { Context } from 'moleculer';

interface Params {
  username: string;
  createdAt: Date;
}

export default async function create(this: MicroService, ctx: Context<Params>) {
  const query = {
    username: ctx.params.username,
  };
  const exist = await ctx
    .call('users.find', {
      query,
      fields: ['_id', 'username'],
    })
    .then(([user]: any) => user);

  if (exist) throw new Error(`This user ${exist.email} already exist!.`);

  ctx.params.createdAt = new Date();
}
