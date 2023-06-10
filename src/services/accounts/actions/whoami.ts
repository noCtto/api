import MoleculerJs from 'moleculer';
const { MoleculerClientError } = MoleculerJs.Errors;

import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

interface Params {}

interface ContextMeta extends Context<Params> {
  meta: {
    oauth: {
      user: {
        id: string;
      };
    };
    token: string;
  };
}

export default {
  async handler(this: MicroService, ctx: ContextMeta & {meta: any} ): Promise<any> {    
    const oauth_user = JSON.parse(JSON.stringify(ctx.meta.user.user));
    const { userId } = oauth_user;
    if (!userId) {
      return new MoleculerClientError('User not found!', 404, 'account', [userId]);
    }
    const user = await this._get(ctx, { id: userId });
    if (!user) {
      return new MoleculerClientError('User not found!', 404, 'account', [userId]);
    }
    return this.transformDocuments(ctx, { fields: ['_id', 'username'] }, user);
  },
};
