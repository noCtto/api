import actions from './actions';
import hooks from './hooks';
import methods from './methods';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/subscribers.entity';

export default {
  database: process.env.DB_NAME,
  collection: 'subscribers',
  fields,
  populates,
  validator,
  actions,
  hooks,
  methods
};
