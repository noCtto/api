import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default {
  rest: 'POST /vote',
  params: {
    id: { type: 'objectID', ObjectID: ObjectId, optional: false },
    d: 'boolean',
  },
  async handler(this:MicroService, ctx:Context & { params: any }):Promise<any> {
    return Promise.resolve(this.vote(ctx));
  },
};
