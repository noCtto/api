import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';

export default async function commentsCount(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  ctx: Context & { params: any}
) {
  console.log('users.populates.comments.count', ctx.params )
  return Promise.all(
    items.map((user: any) =>
      ctx
        .call('comments.count', {
          ...ctx.params,
          query: {
            uid: new ObjectId(user._id),
          },
        })
        .then((comments) => {
          console.log('comments.count', comments)
          
          user.comments = {
            total: comments
          };
          return comments;
        })
    )
  );
}
