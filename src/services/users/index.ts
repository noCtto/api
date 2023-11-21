import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/user.entity';

export default {
  database: 'account',
  collection: 'users',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};
