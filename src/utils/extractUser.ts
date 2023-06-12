import { ObjectId } from 'mongodb';

export default function extractUser(ctx:any): ObjectId | null{
  console.log('Extracting user from context', ctx.meta.user.user);
  
  let usrId = null;
  if (ctx.params.uid) {
    usrId = ctx.params.uid;
  }

  if (ctx.meta.user) {
    if (ctx.meta.user.user) {
      usrId = JSON.parse(JSON.stringify(ctx.meta.user.user))['userId'];
      console.log('Here is the user from context', usrId)
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
  return new ObjectId(usrId);
};
