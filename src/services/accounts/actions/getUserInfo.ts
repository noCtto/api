import { Context } from 'moleculer';
import type { AccountThis } from '../accounts.service';

interface Params {}

export default {
  async handler(this: AccountThis, ctx: Context<Params>): Promise<any> {
    return ctx.meta && ctx.meta;
  },
};
