import actions from '@posts/actions';
import methods from '@posts/methods';
import hooks from '@posts/hooks';
import populates from '@posts/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@posts/entities/post.entity';

export default {
  database: 'nocheto',
  collection: 'posts',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};