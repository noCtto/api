import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function voted(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  const user = this.extractUser(ctx);
  return items.map((item: any) => {
    item.joined = item.subscribers && item.subscribers[String(user)] !== undefined;
    item.joined = item.joined || false
    return item;
  });
}
