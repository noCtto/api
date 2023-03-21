import { toDeepObjectId } from '../../../utils/func';
import type { Context } from "moleculer";
import { VoteThis } from '../votes.service';

export default {
  params: {
    pid: {
      type: 'string',
      optional: true,
    },
    tid: {
      type: 'string',
      optional: true,
    },
    cid: {
      type: 'string',
      optional: true,
    },
    uid: {
      type: 'string',
      optional: true,
    },
    createdAt: {
      type: 'date',
      optional: true,
      default: () => new Date(),
    },
  },
  async handler(this:VoteThis, ctx:Context & { params: any }):Promise<any> {
    const votes = await this._create(
      ctx,
      toDeepObjectId({
        pid: ctx.params.pid,
        tid: ctx.params.tid,
        uid: ctx.params.uid,
        voters: {
          [ctx.params.uid]: 1,
        },
      })
    );
    return votes;
  },
};