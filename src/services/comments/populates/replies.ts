import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function replies(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('comments.populates.replies', ctx.params )
  return Promise.all(
    items.map((item: any) =>
      this.replies(ctx, item._id.toString())
        .then((comments:any) => {
          item.replies = comments;
          return item;
        })
    )
  );
}
