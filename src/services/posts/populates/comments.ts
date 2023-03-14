
import {ObjectId } from 'mongodb';

export default function comments(ids, items, handler, ctx) {
  return this.Promise.all(
    items.map((item) =>
      ctx
        .call('comments.count', {
          query: {
            pid: new ObjectId(item._id),
            // cid: { $exists: false },
          },
        })
        .then((resp) => {
          // console.log('Populating comments for item', resp, 'with pid');
          const o = item;
          o.comments = resp;
          return o;
        })
    )
  );
};
