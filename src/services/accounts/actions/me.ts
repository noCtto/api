import MoleculerJs from 'moleculer';
const { MoleculerClientError } = MoleculerJs.Errors;

import type { Context } from 'moleculer';
import type { AccountThis } from '../accounts.service';

interface Params {}

export default {
  rest: 'GET /whoiam',
  async handler(this: AccountThis, ctx: Context<Params> ): Promise<any> {
    return this.getById(ctx.meta.oauth.user.id)
      .then((user:any) => {
        if (!user) return this.reject(new MoleculerClientError('User not found!', 400));
        return this.transformDocuments(ctx, { fields: ['_id', 'username'] }, user);
      })
      .then((user:any) => this.transformEntity2(user, true, ctx.meta.token));
  },
};
