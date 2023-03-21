import type { Context } from "moleculer";
import { VoteThis } from '../votes.service';


export default function voted(this:VoteThis, ids:any, items:any, handler:any, ctx: Context & { params: any }) {
  const user = this.extractUser(ctx);
  return items.map((item:any) => {
    item.voted = item.voters[String(user)] !== undefined;
    if (item.voted) item.d = item.voters[String(user)];
    return item;
  });
};
