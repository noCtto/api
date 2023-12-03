import { toDeepObjectId } from '../../../utils/func';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default {
  params: {
    filter: 'object',
    project: 'object',
  },
  async handler(this: MicroService, ctx: Context & { params: any; meta: any }) {
    this.logger.debug('sessions.actions.updateOne', ctx.params );
    const { filter, project } = ctx.params;
    return this.adapter.collection.updateOne(
      toDeepObjectId(filter),
      toDeepObjectId(project)
    );
  },
};
