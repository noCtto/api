/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

module.exports = async function replies(ids, items, handler, ctx) {
  console.log('Populating replies', ids);
  return this.Promise.all(
    items.map((item) => {
      console.log('Populating replies for item', item._id, 'with cid');
      return ctx
        .call('comments.list', {
          query: {
            cid: ObjectId(item._id),
          },
          populate: ['replies', 'author', 'votes', 'voted', 'count'],
        })
        .then((comments) => {
          if (!comments) {
            item.replies = {
              page: 0,
              pageSize: 1,
              rows: [],
              total: 0,
              totalPages: 0,
            };
          } else {
            item.replies = comments;
          }
          return item;
        });
    })
  );
};
