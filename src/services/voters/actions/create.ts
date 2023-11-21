import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Voter } from '@voters/entities'
import { ObjectId } from 'mongodb';

type Params = {
  type?: string,
  target: string,
  d?: boolean
}

const params = {
  target: {
    type: 'string',
    required: true,
  },
  d: {
    type: 'boolean',
    required: true,
  },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context<Params>
  ): Promise<any> {
    this.logger.debug('subscribers.actions.create', ctx.params );
    const { target, d } = ctx.params;
    const user:ObjectId = this.extractUser(ctx);
    const voted = await this.voted(ctx, target, user);
    if (voted) return Promise.resolve({ msg: 'Already Voted' })
    const voter: Voter = await this._create(ctx, {
      target,
      uid: String(user),
      d
    }).catch((err:any) => {
      this.logger.error('subscribers.actions.create.error: ', err)
    });
    return voter;
  },
};
