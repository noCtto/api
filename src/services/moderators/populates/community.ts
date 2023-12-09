import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function handler(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('users.populates.community', ctx.params )
  return Promise.all(
    items.map((item: any) => {
      return ctx
        .call('communities.get', {
          id: String(item.target),
          fields: ['_id', 'name', 'icon']
        })
        .then((community:any) => {
          item.community = community;
          return community;
        })
    })
  );
};
