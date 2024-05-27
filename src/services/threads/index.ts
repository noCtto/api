import methods from './methods';
import hooks from './hooks';
import populates from './populates';
import type { MicroService } from '../../lib/microservice';
import all from '../../utils/action.all';

import {
  Validator as validator,
  Fields as fields,
} from './entities/thread.entity';

export default {
  database: 'nocheto',
  collection: 'threads',
  fields,
  validator,
  actions: { all },
  methods,
  hooks,
  populates,
  events: {
    'new.post': {
      group: "other",
      handler(this: MicroService, ctx: any) {
         this.logger.info('THREADS: Post created event!', ctx.params);
      }
    },
  },
};
