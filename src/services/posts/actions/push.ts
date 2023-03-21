
import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

export default async function push(this:PostThis, ctx:Context & { params: any }) {
  const post = await ctx.call('posts.find', { limit: 1 });
  return ctx.call('io.broadcast', {
    namespace: '/', // optional
    event: 'push-posts',
    args: [post], // optional
  });
};
