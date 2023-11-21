import actions from './actions';
import hooks from './hooks';
import methods from './methods';

import {
  Validator as validator,
  Fields as fields,
} from './entities/voters.entity';

export default {
  database: 'nocheto',
  collection: 'voters',
  fields,
  validator,
  actions,
  hooks,
  methods
};
