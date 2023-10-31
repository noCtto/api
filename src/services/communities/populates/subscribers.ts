import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default {
  handler(
    this: MicroService,
    _ids: any,
    items: any,
    _handler: any,
    ctx: Context & { params: { community: string; populate: string } }
  ) {
    return Promise.all(
      items.map((community: any) => {
        if (!community.subscribers) return community;
        const ObjIds = Object.keys(community.subscribers).map(
          (id) => new ObjectId(id)
        );
        return ctx
          .call('users.list', {
            query: {
              _id: {
                $in: ObjIds,
              },
            },
            fields: ['_id', 'username', 'photoUrl'],
          })
          .then((users) => {
            community.subscribers = users;
            return community;
          });
      })
    );
  },
};
