import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

export default function board(this:PostThis, _ids:any, items:any, _handler:any, ctx:Context & { params: any }) {
  console.log('populating post board =>>> ', _ids, items, _handler, ctx.params);
  return Promise.all(
    items.map((item:any) =>
      ctx
        .call('boards.get', {
          id: item.bid.toString(),
        })
        .then((data:any) => {
          const o = item;
          o.board = data;
          return o;
        })
    )
  );
};
