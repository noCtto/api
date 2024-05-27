import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function author(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('comments.populates.author', ctx.params)
  return Promise.all(
    items.map((item: any) =>
      this.author(ctx, item.author.toString())
        .then((user:any) => {
          item.author = user;
          return item;
        })
        .catch((err:any) => {
          this.logger.error('comments.populates.author.error: ', err);
        })
    )
  );
}
