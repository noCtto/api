
import type { Context } from "moleculer";
import { PostThis } from '../../posts.service';

export default function create(this:PostThis, ctx:Context, response:any) {
  ctx.call('io.broadcast', {
    namespace: '/', // optional
    event: 'push-posts',
    args: [response], // optional
    // volatile: true, // optional
    // local: true, // optional
    // rooms: ['room1', 'room2'], // optional
  });
  return response;
};
