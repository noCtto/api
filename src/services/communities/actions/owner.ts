import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

type Params = {
  id: string;
}

const params = {
  id: {
    type: "string",
    convert: true,
    optional: false
  },
}

export default {
  params,
  async handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
    this.logger.debug('communities.is.owner', ctx.params)
    const community =  this._get( ctx, { ...ctx.params });
    if (!community) {
      return false
    }
    return community.owner;
  },
};
