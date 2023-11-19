import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Subscriber } from '@subscribers/entities'

type Params = {
  type?: string,
  target: string,
}

const params = {
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
    this.logger.debug('subscribers.actions.create', ctx.params );
    const { type, target } = ctx.params;
    const user = this.extractUser(ctx);
    const subscribers: Subscriber = await this._create(ctx, {
      type,
      target,
      uid: String(user)
    }).catch((err:any) => {
      this.logger.error('subscribers.actions.create.error: ', err)
    });
    return subscribers;
  },
};
