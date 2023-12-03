import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default async function type(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('awards.populates.type', ctx.params)
  return Promise.all(
    items.map((item: any) => {
      return ctx.call('awards-catalog.get', { id: String(item.type), fields: ['_id','icon'] } ).then((resp:any)=>{
        item.type = resp;
        return item;
      })
    })
  );
}
