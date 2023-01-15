const { ObjectId } = require('mongodb');

module.exports = function comments(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) =>
      ctx
        .call('comments.count', {
          query: {
            pid: ObjectId(item._id),
            cid: { $exists: false },
          },
        })
        .then((resp) => {
          console.log('COUNT', resp);
          const o = item;
          o.comments = resp;
          return o;
        })
    )
  );
};
