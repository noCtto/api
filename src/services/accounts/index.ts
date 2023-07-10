import actions from '@accounts/actions';
import methods from '@accounts/methods';
import hooks from '@accounts/hooks';
import populates from '@accounts/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@accounts/entities/user.entity';

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
