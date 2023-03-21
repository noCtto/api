import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import { VoteThis } from '../votes.service';

export default {
  rest: 'POST /vote',
  params: {
    id: { type: 'objectID', ObjectID: ObjectId, optional: false },
    d: 'boolean',
  },
  async handler(this:VoteThis, ctx:Context & { params: any }):Promise<any> {
    return Promise.resolve(this.vote(ctx));
  },
};
