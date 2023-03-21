import type { Context } from "moleculer";
import { VoteThis } from '../../votes.service';


export default function vote(this:VoteThis, ctx: Context, response:any) {
  console.log('Broadcasting vote count', response);
  ctx.call('io.broadcast', {
    namespace: '/',
    event: `update_votes_count`,
    args: [
      {
        ...response,
      },
    ],
  });
  return response;
};
