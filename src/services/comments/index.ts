import actions from './actions';
import methods from './methods';
import hooks from './hooks';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/comment.entity';

export default {
  database: process.env.DB_NAME,
  collection: 'comments',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates
};
