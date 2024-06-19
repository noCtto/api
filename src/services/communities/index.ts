import actions from './actions';
import methods from './methods';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/community';

export default {
  database: process.env.DB_NAME,
  collection: 'communities',
  fields,
  validator,
  actions,
  methods,
  hooks: {},
  populates,
};
