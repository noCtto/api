import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';
import type { MicroService } from '../../lib/microservice';

import {
  Validator as validator,
  Fields as fields,
} from './entities/votes.entity';

export default {
  database: process.env.DB_NAME,
  collection: 'votes',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
  events: {
    'new.post': {
      group: "other",
      handler(this: MicroService, ctx: any) {
         this.logger.info('VOTES: Post created event!', ctx.params);
      }
    },
  },
};
