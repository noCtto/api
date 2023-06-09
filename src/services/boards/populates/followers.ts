
import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import { BoardThis } from '../boards.service';

export default {
  handler(this:BoardThis, _ids:any, items:any, _handler:any, ctx: Context & { params: { board: string, populate: string } }) {
    console.log('POPULATING Followers', ctx.params);
    return Promise.all(
      items.map((board:any) => {
        if (!board.followers) return board;

        const ObjIds = Object.keys(board.followers).map((id) => new ObjectId(id));
        return ctx
          .call('accounts.list', {
            query: {
              _id: {
                $in: ObjIds,
              },
              // _id: { $in: ObjIds },
            },
            fields: ['_id', 'username', 'photoUrl'],
          })
          .then((users) => {
            board.followers = users;
            return board;
          });
      })
    );
  },
};
