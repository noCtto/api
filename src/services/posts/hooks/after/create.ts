
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default function create(this:MicroService, _ctx:Context, response:any) {
  return response;
};
