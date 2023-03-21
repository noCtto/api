
import { ObjectId } from 'mongodb';

import type { Context } from "moleculer";
import { BoardThis } from '../boards.service';

export default {
  handler(this:BoardThis, ids:any, items:any, handler:any, ctx: Context & { params: { board: string, populate: string } }) {
    return Promise.all(
      items.map((board:any) =>
        ctx
          .call('posts.list', {
            ...ctx.params,
            query: {
              board: new ObjectId(board._id),
            },
            fields: ['_id', 'votes', 'author', 'title', 'text', 'image', 'comments'],
          })
          .then((posts) => {
            board.posts = posts;
            return board;
          })
      )
    );
  },
};
