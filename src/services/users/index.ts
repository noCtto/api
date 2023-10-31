import actions from '@users/actions';
import methods from '@users/methods';
import hooks from '@users/hooks';
import populates from '@users/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@users/entities/user.entity';

export default {
  database: 'account',
  collection: 'users',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};
