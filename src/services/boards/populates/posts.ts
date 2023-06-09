
import { ObjectId } from 'mongodb';

import type { Context } from "moleculer";
import { BoardThis } from '../boards.service';



export default async function posts(this:BoardThis, _ids:any, items:any, _handler:any, ctx: Context & { params: { board: string, populate: string } }) {
  console.log('POPULATING THIS', ctx.params);
  return Promise.all(
    items.map((board:any) =>
      ctx
        .call('posts.list', {
          ...ctx.params,
          query: {
            bid: new ObjectId(board._id),
          },
          fields: ['_id', 'votes', 'author', 'title', 'text', 'image', 'comments'],
        })
        .then((posts) => {
          board.posts = posts;
          return board;
        })
    )
  );
}
