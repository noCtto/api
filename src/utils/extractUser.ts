import { ObjectId } from 'mongodb';

export default function extractUser(ctx:any) {
  let usrId = null;
  if (ctx.params.uid) {
    usrId = ctx.params.uid;
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
