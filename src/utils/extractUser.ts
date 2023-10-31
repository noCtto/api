import { ObjectId } from 'mongodb';
export default function extractUser(ctx: any): ObjectId | null {

  console.log('Extracting User', ctx)
  let meta, params = null;

  if (!ctx.params && !ctx.meta) return null
  
  try {
    meta = JSON.parse(JSON.stringify(ctx.meta));
  } catch (err) {}
  
  try {
    
    params = JSON.parse(JSON.stringify(ctx.params));
  } catch (err) {}

  if (meta?.user?.user?.userId) {
    console.log('Meta user', meta.user.user.userId);
    return new ObjectId(meta.user.user.userId);
  }

  if (meta?.oauth?.user?.id) {
    console.log('Meta oauth', meta.oauth.user.id);
    return new ObjectId(meta.oauth.user.id);
  }

  if (params?.uid) {
    console.log('Params uid', params.uid);
    return new ObjectId(params.uid);
  }

  return null;
}
