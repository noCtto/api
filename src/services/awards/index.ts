import actions from './actions';
import hooks from './hooks';
import methods from './methods';

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
  hooks,
  methods
};
