import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default {
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(
    this: MicroService,
    ctx: Context & { params: any }
  ): Promise<any> {
    const { page, limit } = ctx.params;

    const pipeline = [
      {
        $project: {
          item: 1,
          voters: {
            $objectToArray: '$voters',
          },
        },
      },
      {
        $project: {
          vsize: {
            $size: '$voters',
          },
        },
      },
      {
        $sort: {
          vsize: -1,
        },
      },
      { $skip: ((page || 1) - 1) * (limit || 10) }, // skip the first (page - 1) * limit documents
      { $limit: limit || 10 }, // only return the next limit documents
    ];

    const aggregation = await this.adapter.collection.aggregate(pipeline);
    const result = await aggregation.toArray();
    return result.map((item: any) => new ObjectId(item._id));
  },
};
