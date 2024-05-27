import actions from './actions';
import methods from './methods';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/award.entity';

export default {
  database: 'nocheto',
  collection: 'awards',
  fields,
  validator,
  actions,
  hooks: {},
  methods,
  populates
};
