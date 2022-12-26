const { ObjectId } = require('mongodb');

module.exports = async function replies(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) =>
      ctx
        .call('comments.list', {
          query: {
            cid: ObjectId(item._id),
          },
          populate: ['replies', 'author', 'votes', 'voted', 'count'],
        })
        .then((comments) => {
          item.replies = comments;
          return item;
        })
    )
  );
};
