import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import type { Vote} from '../entities'

type Params = {
  type: string,
  target: string,
}

const params = {
  type: {
    type: 'string',
    optional: true,
    enum: ['pid', 'cid'],
  },
  target: {
    type: 'string',

    optional: true,
  },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context<Params>
  ): Promise<any> {
    this.logger.debug('votes.actions.create', ctx.params );
    const { type, target } = ctx.params;
    const votes: Vote = await this._create(ctx, {
      type,
      target
    }).catch((err:any) => {
      this.logger.error('votes.actions.create.error: ', err)
    });
    return votes;
  },
};
