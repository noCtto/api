
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default async function push(this:MicroService, ctx:Context & { params: any }) {
  const post = await ctx.call('posts.find', { limit: 1 });
  return ctx.call('io.broadcast', {
    namespace: '/', // optional
    event: 'push-posts',
    args: [post], // optional
  });
};
