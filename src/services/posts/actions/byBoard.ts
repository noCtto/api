import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';


export default {
  rest: 'GET /:board/all',
  async handler(this:MicroService, ctx:Context & { params: { board: string } }) {
    console.log('THIS', ctx.params);
  }
}
