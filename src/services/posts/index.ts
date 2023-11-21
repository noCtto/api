import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/post.entity';

export default {
  database: 'nocheto',
  collection: 'posts',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
  // events: {
  //   'posts.created': {
  //     group: "other",
  //     handler(ctx: any) {
  //       this.logger.info('Post created', ctx.params);
  //     }
  //   },
  // },
};
