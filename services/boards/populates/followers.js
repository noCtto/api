const { ObjectId } = require('mongodb');

module.exports = {
  handler(ids, items, handler, ctx) {
    return Promise.all(
      items.map((board) => {
        if (!board.followers) return board;

        const ObjIds = Object.keys(board.followers).map((id) => ObjectId(id));
        return ctx
          .call('users.list', {
            query: {
              _id: {
                $in: ObjIds,
              },
              // _id: { $in: ObjIds },
            },
            fields: ['_id', 'username', 'photoUrl'],
          })
          .then((users) => {
            board.followers = users;
            return board;
          });
      })
    );
  },
};
