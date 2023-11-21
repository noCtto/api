import actions from './actions';
import hooks from './hooks';
import methods from './methods';

import {
  Validator as validator,
  Fields as fields,
} from './entities/subscribers.entity';

export default {
  database: 'nocheto',
  collection: 'subscribers',
  fields,
  validator,
  actions,
  hooks,
  methods
};
