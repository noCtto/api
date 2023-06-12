import actions from '@threads/actions';
import methods from '@threads/methods';
import hooks from '@threads/hooks';
import populates from '@threads/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@threads/entities/thread.entity';

export default {
  database: 'nocheto',
  collection: 'threads',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};