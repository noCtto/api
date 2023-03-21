import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

export default function thread(this:PostThis, ids:any, items:any, handler:any, ctx:Context & { params: any }) {
  return Promise.all(
    items.map((item:any) =>
      ctx
        .call('threads.get', {
          id: item.tid.toString(),
          populate: ['comments'],
        })
        .then((data:any) => {
          const o = item;
          o.thread = data;
          return o;
        })
    )
  );
};
