import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Post } from '../entities';
// import type { Vote } from '@/services/votes/entities';

export default function commentCount(
  this: MicroService,
  _ids: object,
  items: [Post],
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('posts.populates.comments.count', ctx.params )
  return Promise.all(
    items.map((item: Post) =>
      ctx
        .call('comments.count', {
          query: { target: new ObjectId(item._id), type: 'pid' },
        })
        .then((count: any) => {
          item.comments = {
            total: count,
          }
          return item;
        })
        .catch((err) => {
          this.logger.error('posts.populates.comments.count.error: ', err)
          item.comments = 0;
          return item;
        })
    )
  );
}
