export default async function create(ctx) {
  const query = {
    username: ctx.params.username,
  };
  const exist = await ctx
    .call('users.find', {
      query,
      fields: ['_id', 'username'],
    })
    .then(([user]) => user);

  if (exist) throw new Error(`This user ${exist.email} already exist!.`);

  ctx.params.createdAt = new Date();
}
