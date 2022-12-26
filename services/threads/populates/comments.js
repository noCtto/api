/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

module.exports = async function comments(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) =>
      ctx
        .call('comments.list', {
          query: {
            tid: ObjectId(item._id),
            cid: { $exists: false },
          },
          populate: ['replies', 'author', 'votes', 'voted', 'count', 'total'],
        })
        .then((comments) => {
          item.comments = comments;
          return item;
        })
    )
  );
};
