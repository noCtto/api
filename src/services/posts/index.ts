import actions from './actions';
import methods from './methods';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/post.entity';

export default {
  database: process.env.DB_NAME,
  collection: 'posts',
  fields,
  validator,
  actions,
  methods,
  hooks:{},
  populates,
};
