import { toDeepObjectId } from '@utils/func';
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';
import { ObjectId } from 'mongodb';
export default {
  params: {
    type: {
      type: 'string',
      optional: false,
      enum: ['pid', 'cid'],
    },
    target: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: false,
    },
    createdAt: {
      type: 'date',
      optional: true,
      default: () => new Date(),
    },
  },
  async handler(this:MicroService, ctx:Context & { params: any }):Promise<any> {
    const uid = this.extractUser(ctx);
    const { type, target, createdAt } = ctx.params;

    const votes = await this._create(
      ctx,
      toDeepObjectId({
        type, 
        target, 
        createdAt,
        uid,
        voters: {
          [ctx.params.uid]: 1,
        },
      })
    );
    return votes;
  },
};
