
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default async function create(this:MicroService, _ctx:Context, response:any) {
  // TODO - Remunerar Usuário con tokens
  console.log('Post created after hook => ', response);
  try {
    this.broker.broadcast('post.created', { pid: response._id, uid: response.uid })
  } catch (error) {
    this.logger.error(error);
  }


  return response;
};
