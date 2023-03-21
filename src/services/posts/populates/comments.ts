
import {ObjectId } from 'mongodb';

import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

export default function comments(this:PostThis, ids:any, items:any, handler:any, ctx:Context & { params: any }) {
  return Promise.all(
    items.map((item:any) =>
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
