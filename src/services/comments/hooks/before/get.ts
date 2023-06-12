import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default function get(this:MicroService, ctx:Context & { params: any }) {
  ctx.params.populate = ['author'];
};
