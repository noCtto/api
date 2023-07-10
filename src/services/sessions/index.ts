import actions from '@sessions/actions';
import methods from '@sessions/methods';
import hooks from '@sessions/hooks';
import populates from '@sessions/populates';

import {
  Validator as validator,
  Fields as fields,
} from '@sessions/entities/session.entity';

export default {
  database: 'account',
  collection: 'sessions',
  fields,
  validator,
  actions,
  methods,
  hooks,
  populates,
};
