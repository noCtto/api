import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Post } from '@posts/entities';
// import type { Vote } from '@votes/entities';

export default function votes(
  this: MicroService,
  _ids: object,
  items: [Post],
  _handler: any,
  ctx: Context & { params: any }
) {
  console.log('posts.populates.votes', ctx.params )
  return Promise.all(
    items.map((item: Post) =>
      ctx
        .call('votes.find', {
          query: { target: new ObjectId(item._id) },
          populate: ['count', 'voted'],
          fields: ['_id', 'pid', 'count', 'voted', 'votes'],
        })
        .then(([votes]: any) => {
          if (!votes) throw votes;
          item.votes = votes;
          return item;
        })
        .catch((err) => {
          this.logger.error('posts.populates.votes.error: ', err)
          item.votes = {};
          return item;
        })
    )
  );
}
