import type { Context } from "moleculer";
import { PostThis } from '../posts.service';


export default {
  rest: 'GET /:board/all',
  async handler(this:PostThis, ctx:Context & { params: { board: string } }) {
    console.log('THIS', ctx.params);
  }
}
