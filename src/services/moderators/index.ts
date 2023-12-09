import actions from './actions';
import hooks from './hooks';
import methods from './methods';
import populates from './populates';

import {
  Validator as validator,
  Fields as fields,
} from './entities/moderator.entity';

export default {
  database: 'nocheto',
  collection: 'moderators',
  fields,
  validator,
  actions,
  hooks,
  methods,
  populates,
};
