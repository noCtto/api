import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Comment } from '@comments/entities';

export default async function votes(
  this: MicroService,
  _ids: any,
  items: [Comment],
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('comments.populates.votes', ctx.params)
  
  return Promise.all(
    items.map((item: Comment) =>
      ctx
        .call('votes.find', {
          query: {
            target: item._id
          },
          populate: ['voted', 'votes', 'count', 'total'],
          fields: ['_id', 'votes', 'voted', 'count', 'total', 'd'],
        })
        .then(([votes]:any) => {
          if (!votes) throw votes;
          item.votes = votes;
          return item;
        })
        .catch((err:any) => {
          this.logger.error('comments.populates.votes.error: ', err);
          item.votes = null;
          return item;
        })
    )
  );
}
