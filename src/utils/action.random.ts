import { randomId } from '@utils/func';

import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

interface Params {
  num?: number;
}

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(this: MicroService, ctx: Context<Params>): Promise<any> {
    const num = ctx.params.num || 10;
    return this._find(ctx, {
      query: {},
      fields: ['_id'],
    }).then((res: any) => {
      const data = res.map((item: any) => item._id);
      const ids: any = [];
      if (data) {
        const ln = data.length;
        while (ids.length < num) {
          ids.push(randomId(ln, data));
        }
        return ids;
      }
    });
  },
};
