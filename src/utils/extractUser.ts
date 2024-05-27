import { ObjectId } from 'mongodb';

import type { MicroService } from 'lib/microservice'

export default function extractUser(this: MicroService, ctx:any): ObjectId | null {

  if (!ctx) return null;

  let {meta, params} = ctx;

  if (!params && !meta) return null
  
  try {
    meta = JSON.parse(JSON.stringify(meta));
  } catch (err) {
    this.logger.error('Error parsing meta', err);
    return null;
  }

  let userId = null;
  if (meta?.user?.user?.userId) {
    // this.logger.debug('Meta user', meta.user.user.userId);
    userId = meta.user.user.userId;
  }
  if (meta?.user?.id) {
    // this.logger.debug('Meta user', meta.user.user.userId);
    userId = meta.user.id;
  }
  if (meta?.oauth?.user?.id) {
    // this.logger.debug('Meta oauth', meta.oauth.user.id);
    userId = meta.oauth.user.id;
  }
  
  if (params?.uid) {
    userId = params.uid;
  }  

  if (userId) {
    try {
      userId = new ObjectId(userId);
    } catch (err) {
      this.logger.error('Error parsing userId', err);
    }
  };
  return userId;
}