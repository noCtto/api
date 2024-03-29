import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import { ObjectId } from 'mongodb';

type Params = {
  uid: string,
  target: string,
}

const params = {
  target: {
    type: 'string',
    required: true,
    convert:true
  },
  uid: {
    type: 'string',
    required: true,
    convert: true
  },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context<Params>
  ): Promise<any> {
    this.logger.debug('voters.actions.voted', ctx.params );
    const { target } = ctx.params;
    const user:ObjectId = this.extractUser(ctx);
    const voted = await this.voted(ctx, target, user);
    return Promise.resolve(voted)
  },
};
