import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default async function create(
  this: MicroService,
  _ctx: Context,
  response: any
) {
  // TODO - Remunerar Usuário con tokens
  this.logger.debug('Post created after hook => ', response );
  try {
    this.broker.broadcast('post.created', {
      _id: response._id,
      uid: response.uid,
    });
  } catch (error) {
    this.logger.error(error);
  }

  return response;
}
