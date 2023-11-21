import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import type { Award } from '../entities'
import { ObjectId } from 'mongodb';

type Params = {
  type?: string,
  target: string,
}

const params = {
  target: {
    type: 'string',
    required: true,
  },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context<Params>
  ): Promise<any> {
    this.logger.debug('awards.actions.create', ctx.params );
    const { target } = ctx.params;
    const user:ObjectId = this.extractUser(ctx);
    const given = await this.given(ctx, target, user);
    
    if (given) return Promise.resolve({ msg: 'Already given' })
    const awards: Award = await this._create(ctx, {
      target,
      uid: String(user)
    }).catch((err:any) => {
      this.logger.error('awards.actions.create.error: ', err)
    });
    return awards;
  },
};
