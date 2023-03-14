import { isObjectId } from '../../../../utils/func';

export default async function get(ctx) {
  if (ctx.params.id && !isObjectId(ctx.params.id) && typeof ctx.params.id === 'string') {
    const query = {
      username: ctx.params.id,
    };
    const exist = await ctx
      .call('users.find', {
        query,
        fields: ['_id'],
      })
      .then(([user]) => user);

    if (exist) {
      ctx.params.id = exist._id;
    }
  }
};
