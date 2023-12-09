import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Subscriber } from '../entities'
import { ObjectId } from 'mongodb';
import { MoleculerClientError } from '@/utils/error';
type Params = {
  type?: string,
  target: string,
  userTarget: string,
}

const params = {
  target: {
    type: 'string',
    required: true,
  },
  userTarget: {
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
    this.logger.debug('moderators.actions.create', ctx.params );
    const { target, userTarget } = ctx.params;
    
    const uid:ObjectId = this.extractUser(ctx);
    
    if (!uid) return Promise.reject(new MoleculerClientError('Unauthorized', 401));

    // community exists
    const community:any = await ctx.call('communities.get', { id:target, populate:'owner,user' })
    if (!community) return Promise.reject(new MoleculerClientError('Community not found', 404, 'communities'));

    // user is owner
    if (!community.owner) return Promise.reject(new MoleculerClientError('Community has no owner', 405, 'communities'));

    const moderator = await this.exists(ctx, target, userTarget);
    if (moderator) return Promise.resolve({ msg: 'Already Moderating' })
    
    const moderators: Subscriber = await this._create(ctx, {
      target,
      uid: String(userTarget),
      createdBy: String(uid),
    }).catch((err:any) => {
      this.logger.error('moderators.actions.create.error: ', err)
    });
    return moderators;
  },
};
