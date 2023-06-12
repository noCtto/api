import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';


export default function voted(this:MicroService, _ids:any, items:any, _handler:any, ctx: Context & { params: any }) {
  const user = this.extractUser(ctx);
  return items.map((item:any) => {
    item.voted = item.voters[String(user)] !== undefined;
    if (item.voted) item.d = item.voters[String(user)];
    return item;
  });
};
