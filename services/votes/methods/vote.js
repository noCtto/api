const { ValidationError } = require('moleculer').Errors;
const dayjs = require('dayjs');

module.exports = function vote(ctx) {
  const { id, d } = ctx.params;
  const user = this.extractUser(ctx);
  if (!user) return this.Promise.reject(new ValidationError('no user'));

  const dateTime = dayjs().unix();
  return this._get(ctx, { id }).then((card) => {
    let bool = d;
    if (!card) this.Promise.reject(new ValidationError('error', 'number', 400));
    const { voters } = card;
    if (card.voters[String(user)] !== undefined && card.voters[String(user)] === d) {
      bool = null;
    }
    return this._update(ctx, {
      id: card._id,
      voters: {
        ...voters,
        [String(user)]: bool,
      },
      updatedAt: dayjs().toDate(),
    })
      .then((json) =>
        this.transformDocuments(
          ctx,
          {
            populate: ['votes', 'count'],
            fields: ['_id', 'count', 'pid', 'tid', 'cid'],
          },
          { ...json }
        )
      )
      .then((v) => ({ ...v, key: `${card._id}-${card.pid}-${dateTime}-${user}-vote` }));
  });
};
