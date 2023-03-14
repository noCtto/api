
import { ObjectId } from 'mongodb';

export default async function comments(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) => {
      console.log('Populating comments', item, 'for thread');
      return ctx
        .call('comments.list', {
          query: {
            tid: new ObjectId(item._id),
            cid: { $exists: false },
          },
          populate: ['replies', 'author', 'votes', 'voted', 'count', 'total'],
        })
        .then((comments) => {
          item.comments = comments;
          return item;
        });
    })
  );
};
