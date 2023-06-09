import { ObjectId } from 'mongodb';

export default function extractUser(ctx:any): ObjectId | null{
  let usrId = null;
  if (ctx.params.uid) {
    usrId = ctx.params.uid;
  }

  if (ctx.meta.user) {
    if (ctx.meta.user.user.id) {
      return ctx.meta.user.user['id'];
    }
    return new ObjectId(usrId);
  }


  if (ctx.meta.oauth) {
    if (ctx.meta.oauth.user) {
      usrId = ctx.meta.oauth.user.id;
    } else {
      usrId = ctx.meta.oauth.id;
    }
  }
  return usrId && new ObjectId(usrId);
};
