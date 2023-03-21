import MoleculerJs from 'moleculer';
const { MoleculerClientError } = MoleculerJs.Errors;

import type { Context } from 'moleculer';
import type { AccountThis } from '../accounts.service';

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
  rest: 'GET /whoiam',
  async handler(this: AccountThis, ctx: ContextMeta ): Promise<any> {
    return this.getById(ctx.meta.oauth.user.id)
      .then((user:any) => {
        if (!user) return this.reject(new MoleculerClientError('User not found!', 400));
        return this.transformDocuments(ctx, { fields: ['_id', 'username'] }, user);
      })
      .then((user:any) => this.transformEntity2(user, true, ctx.meta.token));
  },
};
