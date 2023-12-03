import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Subscriber } from '../entities'
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
    this.logger.debug('subscribers.actions.create', ctx.params );
    const { target } = ctx.params;
    const user:ObjectId = this.extractUser(ctx);
    const subscribed = await this.subscribed(ctx, target, user);
    
    if (subscribed) return Promise.resolve({ msg: 'Already Subscribed' })
    const subscribers: Subscriber = await this._create(ctx, {
      target,
      uid: String(user)
    }).catch((err:any) => {
      this.logger.error('subscribers.actions.create.error: ', err)
    });
    return subscribers;
  },
};
