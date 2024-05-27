import voteState from './voteState';
import type { MicroService } from '../../../lib/microservice'
import type { Context } from 'moleculer'

export default {
  voteState,
  async voted(this: MicroService, _ctx:Context, target: string, uid: string) {
    const voted = await this.adapter.db.collection('voters').findOne({ target, uid });
    if (voted) {
      return voted;
    }
    return false;
  }
};
