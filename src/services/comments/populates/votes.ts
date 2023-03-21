import type { Context } from "moleculer";
import { CommentThis } from '../comments.service';


export default async function votes(this:CommentThis, ids:any, items:any, handler:any, ctx:Context & { params: any }) {
  return Promise.all(
    items.map((item:any) =>
      ctx
        .call('votes.get', {
          id: item.vid.toString(),
          populate: ['voted', 'votes', 'count', 'total'],
          fields: ['_id', 'votes', 'voted', 'count', 'total', 'd'],
        })
        .then((votes) => {
          item.votes = votes;
          return item;
        })
        .catch((err) => {
          console.log('ERROR! => Populating votes: ', err);
          item.votes = null;
          return item;
        })
    )
  );
};
