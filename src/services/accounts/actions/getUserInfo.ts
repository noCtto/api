import { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

interface Params {}

export default {
  async handler(this: MicroService, ctx: Context<Params>): Promise<any> {
    return ctx.meta && ctx.meta;
  },
};
