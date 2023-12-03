import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default function author(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('posts.populates.author', ctx.params )
  return Promise.all(
    items.map((item: any) =>
      ctx
        .call('users.get', {
          id: String(item.uid) || '',
          populate: ['gravatar'],
          fields: ['_id', 'username', 'gravatar'],
        })
        .then((user: any) => {
          if (!user) throw user;
          item.author = user;
          return item;
        }).catch((err)=> {
          this.logger.error('posts.populate.author.error: ', err)
          item.author = {}
          return item
        })
    )
  );
}
