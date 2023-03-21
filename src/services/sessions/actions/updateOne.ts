import { toDeepObjectId } from '../../../utils/func';
import type { Context } from "moleculer";
import { SessionThis } from '../sessions.service';

export default {
  params: {
    filter: 'object',
    project: 'object',
  },
  async handler(this:SessionThis, ctx:Context & { params: any, meta: any }) {
    const { filter, project } = ctx.params;
    return this.adapter.collection.updateOne(
      toDeepObjectId(filter),
      toDeepObjectId(project)
    );
  },
};
