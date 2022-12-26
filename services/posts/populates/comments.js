const { ObjectId } = require('mongodb');

module.exports = function comments(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) =>
      ctx
        .call('comments.count', {
          query: {
            tid: ObjectId(item.thread),
            cid: { $exists: false },
          },
        })
        .then((resp) => {
          const o = item;
          o.comments = resp;
          return o;
        })
    )
  );
};
