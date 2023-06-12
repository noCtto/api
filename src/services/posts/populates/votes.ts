import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default function comments(this:MicroService, _ids:any, items:any, _handler:any, ctx:Context & { params: any }) {
  return Promise.all(
    items.map((item:any) =>
      ctx
        .call('votes.get', {
          id: item?.vid?.toString(),
          populate: ['count', 'voted'],
          fields: ['_id', 'pid', 'tid', 'count', 'voted'],
        })
        .then((data:any) => {
          const o = item;
          o.votes = data;
          return o;
        })
    )
  );
};
