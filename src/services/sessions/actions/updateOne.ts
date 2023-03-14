import { toDeepObjectId } from '../../../utils/func';

export default {
  params: {
    filter: 'object',
    project: 'object',
  },
  handler(ctx) {
    const { filter, project } = ctx.params;
    return this.adapter.collection.updateOne(
      toDeepObjectId(filter),
      toDeepObjectId(project)
    );
  },
};
