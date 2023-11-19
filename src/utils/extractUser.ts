import { ObjectId } from 'mongodb';
export default function extractUser(ctx: any): ObjectId | null {

  let meta, params = null;

  if (!ctx.params && !ctx.meta) return null
  
  try {
    meta = JSON.parse(JSON.stringify(ctx.meta));
  } catch (err) {}

  if (meta?.user?.user?.userId) {
    // this.logger.debug('Meta user', meta.user.user.userId);
    return new ObjectId(meta.user.user.userId);
  }
  
  if (meta?.user?.id) {
    // this.logger.debug('Meta user', meta.user.user.userId);
    return new ObjectId(meta.user.id);
  }

  if (meta?.oauth?.user?.id) {
    // this.logger.debug('Meta oauth', meta.oauth.user.id);
    return new ObjectId(meta.oauth.user.id);
  }

  try {
    params = JSON.parse(JSON.stringify(ctx.params));
  } catch (err) {}

  if (params?.uid) {
    // this.logger.debug('Params uid', params.uid);
    return new ObjectId(params.uid);
  }

  return null;
}