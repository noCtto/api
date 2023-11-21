import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/thread.entity';

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
