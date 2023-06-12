import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default async function comment(this:MicroService, ctx:Context, response:any) {
  const post:any = await ctx.call('posts.get', {
    id: response.pid.toString(),
    populate: ['comments'],
    fields: ['_id', 'comments'],
  });

  
  try {
    // console.log('Broadcasting update-comment-count', q);
    const io = await ctx.call('io.broadcast', {
      namespace: '/',
      event: `post_update_comment_count`,
      args: [{
        count: post.comments,
        pid: post._id,
        tid: response.tid,
      }],
    });
    return io;
  } catch (error) {
    console.log('Error broadcasting update-comment-count', error);
  }

  return response;
};
