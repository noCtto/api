import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Post } from '../entities';
// import type { Vote } from '@/services/votes/entities';
const groupTypes = (data:any) => {
  const types:any = {}
  data.forEach((c: any) => {
    if (types[c.type.icon]) types[c.type.icon] += 1
    else types[c.type.icon] = 1
  })
  return types;
}
export default function commentCount(
  this: MicroService,
  _ids: object,
  items: [Post],
  _handler: any,
  ctx: Context & { params: any }
) {
  this.logger.debug('posts.populates.awards.count', ctx.params )
  return Promise.all(
    items.map((item: Post) =>
      ctx
        .call('awards.find', {
          query: { 
            target: new ObjectId(item._id) 
          },
          populate:['types']
        })
        .then((awards: any) => {
          const types:any = groupTypes(awards)
          item.awards = {
            total: awards.length,
            types,
          }
          return item;
        })
        .catch((err) => {
          this.logger.error('posts.populates.comments.count.error: ', err)
          item.awards = {
            total: 0,
            types: {},
          };
          return item;
        })
    )
  );
}
