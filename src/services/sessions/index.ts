import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/session.entity';

export default {
  database: 'account',
  collection: 'sessions',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};
