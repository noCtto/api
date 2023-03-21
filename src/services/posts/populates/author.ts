import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

export default function author(this:PostThis, ids:any, items:any, handler:any, ctx:Context & { params: any }) {
  return Promise.all(
    items.map((item:any) =>
      ctx
        .call('users.get', {
          id: item.uid.toString(),
          populate: ['gravatar'],
        })
        .then((data:any) => {
          const o = item;
          o.author = data;
          return o;
        })
    )
  );
};
