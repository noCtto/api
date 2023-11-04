import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Post } from '@posts/entities'

export default function community(
  this: MicroService,
  _ids: any,
  items: [Post],
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('posts.populates.community', _ids, items, _handler, ctx.params);
  return Promise.all(
    items.map((item: Post) =>
      ctx
        .call('communities.get', {
          id: item.cid.toString(),
          fields: [
            '_id',
            'name',
            'slug',
            'description',
            'image',
            'icon',
            'banner',
          ],
        })
        .then((data: any) => {
          item.community = data;
          return item;
        })
        .catch((err) => {
          console.error('posts.populates.community', err)
          item.community = {}
          return item
        })
    )
  );
}
