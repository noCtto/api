const { ObjectId } = require('mongodb');

module.exports = {
  handler(ids, items, handler, ctx) {
    return Promise.all(
      items.map((board) =>
        ctx
          .call('posts.list', {
            ...ctx.params,
            query: {
              board: ObjectId(board._id),
            },
            fields: ['_id', 'votes', 'author', 'title', 'text', 'image', 'comments'],
          })
          .then((posts) => {
            board.posts = posts;
            return board;
          })
      )
    );
  },
};