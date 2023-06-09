
import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import { CommentThis } from '../comments.service';

export default async function replies(this:CommentThis, _ids:any, items:any, _handler:any, ctx:Context & { params: any }) {
  // console.log('Populating replies', ids);
  return Promise.all(
    items.map((item:any) =>
      // console.log('Populating replies for item', item._id, 'with cid');
      ctx
        .call('comments.list', {
          query: {
            cid: new ObjectId(item._id),
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
        })
    )
  );
};
