
import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import { ThreadThis } from '../threads.service';

export default async function comments(this:ThreadThis, ids:any, items:any, handler:any, ctx:Context & { params: any }) {
  return Promise.all(
    items.map((item:any) => {
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
