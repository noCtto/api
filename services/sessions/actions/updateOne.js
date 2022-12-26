const { toDeepObjectId, toDeepDate } = require('../../../utils/func');

module.exports = {
  params: {
    filter: 'object',
    project: 'object',
  },
  handler(ctx) {
    const { filter, project } = ctx.params;
    return this.adapter.collection.updateOne(
      toDeepObjectId(filter),
      toDeepObjectId(toDeepDate(project))
    );
  },
};
