import type { MicroService } from '@lib/microservice';
import type { Context } from 'moleculer';

import type { Params } from './params'

export default async function handler(
  this: MicroService,
  ctx: Context<Params>
): Promise<any> {
  this.logger.debug('users.actions.resetPassword', ctx.params )
  
  const { username } = ctx.params;


  const user: any = await this.getByUsername(ctx, username);

  if (!user) throw new Error('User not found');

  return Promise.resolve(() => {

    return { msg: 'Ok!'}
  })
};
